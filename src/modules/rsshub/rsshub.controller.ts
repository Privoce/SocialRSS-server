import { CacheTTL, Controller, Get, Header, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { RSSHubQueryDto } from './rsshub.dto'
import { RSSHubService } from './rsshub.service'

@Controller('rsshub')
@ApiName
export class RSSHubController {
  constructor(private readonly rsshubService: RSSHubService) {}

  @Get('/')
  @ApiOperation({
    summary: '从 RSSHub 获取',
  })
  @Header('Cache-Control', 'public, max-age=600')
  @CacheTTL(60)
  async getRSSFromRSSHub(@Query() query: RSSHubQueryDto) {
    return this.rsshubService.getRSSFromRSSHub(query.url)
  }
}
