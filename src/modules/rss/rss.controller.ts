import { Body, Controller, Post } from '@nestjs/common'
import { RssDispatchDto } from './rss.dto'
import { RssService } from './rss.service'

@Controller('rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}
  @Post('/dispatch')
  async dispatchWebsiteRss(@Body() body: RssDispatchDto) {
    const { url } = body
    return this.rssService.dispatchRss(url)
  }
}
