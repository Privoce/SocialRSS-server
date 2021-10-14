import { Controller, Get } from '@nestjs/common'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
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
}
