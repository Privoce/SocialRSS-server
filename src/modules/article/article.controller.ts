import { Controller } from '@nestjs/common'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { ArticleService } from './article.service'

@Controller('articles')
@ApiName
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
}
