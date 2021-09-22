import { Controller, Get, Param } from '@nestjs/common'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IdDto } from '~/shared/dto/id.dto'
import { SiteService } from './site.service'

@Controller('sites')
@ApiName
export class SiteController {
  constructor(private readonly siteService: SiteService) {}
  @Get('/:id')
  async getRssListBySiteId(@Param() params: IdDto) {
    const { id } = params
    return this.siteService.getAllArticlesBySiteId(id)
  }
}
