import { Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { HTTPDecorators } from '~/common/decorator/http.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { IdDto } from '~/shared/dto/id.dto'
import { PaginateDto } from '~/shared/dto/paginate.dto'
import { SiteService } from './site.service'

@Controller('sites')
@ApiName
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('/')
  @ApiProperty({
    description: '列出所有站点分页',
  })
  @HTTPDecorators.Paginator
  async getList(@Query() query: PaginateDto) {
    const { page, limit } = query
    return this.siteService.paginate({ page, limit })
  }

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
