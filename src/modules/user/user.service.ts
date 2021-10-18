import { BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { compareSync, hashSync } from 'bcrypt'
import { Connection, Repository } from 'typeorm'
import { HASH } from '~/app.config'
import { UserSecureEntity } from '~/processors/database/entities/user_secure.entity'
import { UserEntity } from '../../processors/database/entities/user.entity'
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    @InjectRepository(UserSecureEntity)
    private secureRepository: Repository<UserSecureEntity>,

    private connection: Connection,
  ) {}

  public get dao() {
    return this.usersRepository
  }

  async resetPassword(id: string, old: string, new$: string) {
    if (old === new$) {
      throw new BadRequestException(
        'new password must be different from old one',
      )
    }
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new BadRequestException('user not found')
    }
    const validPassword = compareSync(old, user.password)
    if (!validPassword) {
      throw new BadRequestException('old password is not valid')
    }
    const newPassword = hashSync(new$, HASH.salt)

    // then remove all login record
    await this.connection.transaction(async (manager) => {
      await Promise.all([
        manager
          .createQueryBuilder()
          .delete()
          .from(UserSecureEntity)
          .where('user_id = :id', { id })
          .execute(),
        manager
          .createQueryBuilder()
          .update(UserEntity)
          .set({
            password: newPassword,
          })
          .where('id = :id', { id })
          .execute(),
      ])
    })
  }

  async logoutAll(id: string) {
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(UserSecureEntity)
      .where('user_id = :id', { id })
      .execute()
  }
}
