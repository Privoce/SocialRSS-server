import { Body, Controller, Delete, Get, Post, Scope } from '@nestjs/common'
import { Agent } from '~/common/decorator/agent.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { IpLocation, IpRecord } from '~/common/decorator/ip.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { UserWithJwt } from '~/shared/interfaces/user-jwt.interface'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'

@Controller({
  path: 'auth',
  scope: Scope.REQUEST,
})
@ApiName
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(
    @Body() body: LoginDto,
    @Agent() agent: string,
    @IpLocation() { ip }: IpRecord,
  ) {
    return this.authService.login(body.username, body.password, agent, ip)
  }

  @Post('/register')
  async register(
    @Body() body: UserEntity,
    @Agent() agent: string,
    @IpLocation() { ip }: IpRecord,
  ) {
    Reflect.deleteProperty(body, 'role')
    const user = await this.authService.createUser(body)
    Reflect.deleteProperty(user, 'password')
    return {
      ...user,
      token: await this.authService.signToken(user.id, agent, ip),
    }
  }

  @Get('/check')
  async checkIsLogged(@CurrentUser() user: UserWithJwt) {
    if (!user) {
      return { status: 0 }
    }
    return {
      status: +Boolean(await this.authService.verifyPayload(user.payload)),
    }
  }

  @Auth()
  @Delete('/logout')
  async logout(@CurrentUser() user: UserWithJwt) {
    return this.authService.logout(user)
  }
}
