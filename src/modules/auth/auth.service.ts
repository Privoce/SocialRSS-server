import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compareSync, hashSync } from 'bcrypt'
import { nanoid } from 'nanoid'
import { Repository } from 'typeorm'
import { HASH } from '~/app.config'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { UserSecureEntity } from '~/processors/database/entities/user_secure.entity'
import { UserWithJwt } from '~/shared/interfaces/user-jwt.interface'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
    @InjectRepository(UserSecureEntity)
    private readonly userSecureModel: Repository<UserSecureEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string, agent: string, ip: string) {
    const user = await this.userModel.findOne({ where: { name: username } })
    if (!user) {
      throw new BadRequestException('user not exist.')
    }
    const isMatch = compareSync(password, user.password)
    if (!isMatch) {
      throw new BadRequestException('password not match.')
    }

    Reflect.deleteProperty(user, 'password')

    const token = await this.signToken(user.id, agent, ip)
    Object.assign(user, { token })
    return user
  }
  async signToken(id: string, agent: string, ip: string) {
    const user = await this.userModel.findOne(id)
    if (!user) {
      throw new BadRequestException('user not exist.')
    }

    const code = nanoid(6)
    const payload: JwtPayload = {
      id,
      agent,
      code,
    }
    const token = this.jwtService.sign(payload)
    await this.userSecureModel.save({
      agent,
      auth_code: code,
      ip,
      last_login: new Date(),
      user_id: id,
    })

    return token
  }
  async verifyPayload(payload: JwtPayload) {
    const user = await this.userModel.findOne({
      where: { id: payload.id },
    })

    if (!user) {
      return false
    }
    const secure = await this.userSecureModel.findOne({
      where: { auth_code: payload.code, user_id: user.id },
    })
    if (!secure) {
      return false
    }

    return user
  }

  async createUser(body: UserEntity) {
    const isExist = await this.userModel.findOne({
      where: [
        { name: body.name },
        {
          email: body.email,
        },
      ],
    })
    if (isExist) {
      throw new BadRequestException('user already exist.')
    }
    body.password = hashSync(body.password, HASH.salt)
    body.created_at = new Date()
    return await this.userModel.save(body)
  }

  async logout(user_: UserWithJwt) {
    const user = await this.userModel.findOne(user_.id)
    if (!user) {
      return
    }
    await this.userSecureModel.delete({
      auth_code: user_.payload.code,
    })
  }
}
