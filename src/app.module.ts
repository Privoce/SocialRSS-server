import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { GuestCheckGuard } from './common/guard/roles.guard'
import { SkipBrowserDefaultRequestMiddleware } from './common/middlewares/favicon.middleware'
import { SecurityMiddleware } from './common/middlewares/security.middleware'
import { ArticleModule } from './modules/article/article.module'
import { AuthModule } from './modules/auth/auth.module'
import { RssModule } from './modules/rss/rss.module'
import { SiteModule } from './modules/site/site.module'
import { UserModule } from './modules/user/user.module'
import { CacheModule } from './processors/cache/cache.module'
import { DatabaseModule } from './processors/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.production.local',
        '.env.production',
        '.env',
      ],
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule,

    AuthModule,
    UserModule,
    RssModule,
    SiteModule,
    ArticleModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SkipBrowserDefaultRequestMiddleware, SecurityMiddleware)
      .forRoutes({ path: '(.*?)', method: RequestMethod.ALL })
  }
}
