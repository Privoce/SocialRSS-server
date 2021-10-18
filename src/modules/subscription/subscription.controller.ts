import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { IdDto } from '~/shared/dto/id.dto'
import { SubscriptionService } from './subscription.service'

@Controller('/subscription')
@ApiName
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Auth()
  @Get('/@me')
  async getMySubscription(@CurrentUser() user: UserEntity) {
    return this.subscriptionService.getUserSubscriptions(user.id)
  }

  @Auth()
  @Post('/website/:id')
  @ApiProperty({
    description: '订阅一个站点, 目前和 /sites/star/ 功能一样',
  })
  async subscriptionWebsite(
    @CurrentUser() user: UserEntity,
    @Param() param: IdDto,
  ) {
    const { id } = param

    return this.subscriptionService.subscribe(user.id, 'site', id)
  }
}
