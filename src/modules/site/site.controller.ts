import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
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
  @ApiOperation({
    summary: '列出所有站点分页',
  })
  @HTTPDecorators.Paginator
  async getList(@Query() query: PaginateDto) {
    const { page, limit } = query
    return this.siteService.paginate({ page, limit })
  }

  @Get('/:id')
  @ApiOperation({
    summary: '获取站点信息',
    description: 'Top5, 总数',
  })
  async getRssListBySiteId(@Param() params: IdDto) {
    const { id } = params
    return this.siteService.getSiteDetailAndTopArticle(id)
  }

  @Patch('/star/:id')
  @ApiOperation({
    summary: 'Star 一个站点',
  })
  @Auth()
  async starSite(@Param() params: IdDto, @CurrentUser() user: UserEntity) {
    const { id } = params
    await this.siteService.starSite(id, user.id)
    return
  }

  @Delete('/:id')
  @Auth()
  async deleteSite(@Param() param: IdDto) {
    // TODO
  }
}
