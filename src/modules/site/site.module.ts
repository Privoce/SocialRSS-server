import { forwardRef, Module } from '@nestjs/common'
import { ArticleModule } from '../article/article.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { UserModule } from '../user/user.module'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

@Module({
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
  imports: [
    forwardRef(() => ArticleModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => UserModule),
  ],
})
export class SiteModule {}
