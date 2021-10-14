import { Controller, Get, Header, Query } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { RSSHubQueryDto } from './rsshub.dto'
import { RSSHubService } from './rsshub.service'

@Controller('rsshub')
export class RSSHubController {
  constructor(private readonly rsshubService: RSSHubService) {}

  @Get('/')
  @ApiProperty({ description: '从 RSSHub 获取' })
  @Header('Cache-Control', 'public, max-age=600')
  @Header('Content-Type', 'text/xml')
  async getRSSFromRSSHub(@Query() query: RSSHubQueryDto) {
    return await this.rsshubService.getRSSFromRSSHub(query.url)
  }
}
