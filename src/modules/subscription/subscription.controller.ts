import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
import {
  SubscriptionParamIdDto,
  SubscriptionParamIdsDto,
} from './subscription.dto'
import { SubscriptionService } from './subscription.service'

@Controller('/subscription')
@ApiName
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Auth()
  @Get('/@me')
  @ApiOperation({ summary: '获取自己所有的订阅' })
  async getMySubscription(@CurrentUser() user: UserEntity) {
    return this.subscriptionService.getUserSubscriptions(user.id)
  }

  @Get('/:type/:ids')
  @ApiOperation({ summary: '获取某种类型的订阅列表' })
  // @HTTPDecorators.QueryRelative([['user_id', 'users']], true)
  async getTypeOfSubscription(@Param() param: SubscriptionParamIdsDto) {
    const { ids, type } = param

    const entitiesMap = {}
    const objects = { users: {} }
    for (const id of ids) {
      const [entries, _objects] =
        await this.subscriptionService.getTypeOfSubscription(type, id)

      entitiesMap[id] = entries
      objects.users = { ...objects.users, ..._objects.users }
    }
    // TODO
    return {
      data: { entities: entitiesMap, type },
      objects,
    }
  }

  @Auth()
  @Post('/:type/:id')
  @ApiOperation({
    summary: '订阅一个站点/文章/etc.',
  })
  async subscriptionWebsite(
    @CurrentUser() user: UserEntity,
    @Param() param: SubscriptionParamIdDto,
  ) {
    const { id, type } = param

    return this.subscriptionService.subscribe(user.id, type, id)
  }
}
