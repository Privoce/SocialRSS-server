import { Controller, Get, Param, Patch } from '@nestjs/common'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
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

  @Patch('/star/:id')
  @Auth()
  async starSite(@Param() params: IdDto, @CurrentUser() user: UserEntity) {
    const { id } = params
    await this.siteService.starSite(id, user.id)
    return
  }
}
