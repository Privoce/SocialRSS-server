import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { SkipBrowserDefaultRequestMiddleware } from './common/middlewares/favicon.middleware'
import { SecurityMiddleware } from './common/middlewares/security.middleware'
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

    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SkipBrowserDefaultRequestMiddleware, SecurityMiddleware)
      .forRoutes({ path: '(.*?)', method: RequestMethod.ALL })
  }
}
