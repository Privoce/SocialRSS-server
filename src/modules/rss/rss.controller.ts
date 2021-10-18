import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { RssDispatchDto } from './rss.dto'
import { RSSService } from './rss.service'

@Controller('rss')
@Auth()
@ApiName
export class RSSController {
  constructor(private readonly rssService: RSSService) {}
  @Post('/dispatch')
  @ApiOperation({
    summary: '发现 RSS 并解析',
  })
  async dispatchWebsiteRSS(
    @Body() body: RssDispatchDto,
    @CurrentUser() user: UserEntity,
  ) {
    const { url } = body
    return this.rssService.dispatchRSS(url, user.id)
  }
}
