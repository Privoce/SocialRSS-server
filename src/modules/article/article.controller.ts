import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { IdDto } from '~/shared/dto/id.dto'
import { ArticleService } from './article.service'

@Controller('articles')
@ApiName
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/:id')
  @ApiOperation({
    summary: '获取文章',
  })
  async getArticle(@Param() param: IdDto) {
    return await this.articleService.findById(param.id)
  }
}
