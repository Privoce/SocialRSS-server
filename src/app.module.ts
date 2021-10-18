import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { GuestCheckGuard } from './common/guard/roles.guard'
import { HttpCacheInterceptor } from './common/interceptors/cache.interceptor'
import { JSONSerializeInterceptor } from './common/interceptors/json-serialize.interceptor'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { SkipBrowserDefaultRequestMiddleware } from './common/middlewares/favicon.middleware'
import { SecurityMiddleware } from './common/middlewares/security.middleware'
import { ArticleModule } from './modules/article/article.module'
import { AuthModule } from './modules/auth/auth.module'
import { RSSModule } from './modules/rss/rss.module'
import { RSSHubModule } from './modules/rsshub/rsshub.module'
import { SiteModule } from './modules/site/site.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { UserModule } from './modules/user/user.module'
import { CacheModule } from './processors/cache/cache.module'
import { DatabaseModule } from './processors/database/database.module'
import { HelperModule } from './processors/helper/helper.module'

@Module({
  imports: [
    DatabaseModule,
    CacheModule,

    AuthModule,
    UserModule,
    RSSModule,
    RSSHubModule,
    SiteModule,
    ArticleModule,
    SubscriptionModule,

    HelperModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GuestCheckGuard,
    },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JSONSerializeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SkipBrowserDefaultRequestMiddleware, SecurityMiddleware)
      .forRoutes({ path: '(.*?)', method: RequestMethod.ALL })
  }
}
