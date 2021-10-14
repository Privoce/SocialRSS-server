import { Body, Controller, Post } from '@nestjs/common'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { RssDispatchDto } from './rss.dto'
import { RSSService } from './rss.service'

@Controller('rss')
@Auth()
@ApiName
export class RSSController {
  constructor(private readonly rssService: RSSService) {}
  @Post('/dispatch')
  async dispatchWebsiteRSS(@Body() body: RssDispatchDto) {
    const { url } = body
    return this.rssService.dispatchRSS(url)
  }
}
