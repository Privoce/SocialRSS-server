import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import {
  UserEntity,
  UserEntityPartial,
} from '~/processors/database/entities/user.entity'
import { PasswordDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
@Auth()
@ApiName
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/')
  async updateMe(
    @Body() body: UserEntityPartial,
    @CurrentUser() user: UserEntity,
  ) {
    Reflect.deleteProperty(body, 'id')
    Reflect.deleteProperty(body, 'password')
    Reflect.deleteProperty(body, 'created_at')
    Reflect.deleteProperty(body, 'role')
    await this.userService.dao.update(user.id, body)
  }

  @Post('/reset/password')
  async resetPassword(
    @Body() body: PasswordDto,
    @CurrentUser() user: UserEntity,
  ) {
    const { oldPassword, password } = body
    await this.userService.resetPassword(user.id, oldPassword, password)
  }

  @Get('/flushall')
  async logoutall(@CurrentUser() user: UserEntity) {
    await this.userService.logoutAll(user.id)
  }
}
