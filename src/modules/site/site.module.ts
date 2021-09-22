import { forwardRef, Module } from '@nestjs/common'
import { ArticleModule } from '../article/article.module'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

@Module({
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
  imports: [forwardRef(() => ArticleModule)],
})
export class SiteModule {}
