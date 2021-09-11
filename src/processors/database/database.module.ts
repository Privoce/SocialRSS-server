import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MYSQL_DB } from '~/app.config'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { ArticleEntity } from './entities/article.entity'
import { SiteEntity } from './entities/site.entity'
import { UserSecureEntity } from './entities/user_secure.entity'
import { UserSubscriptionEntity } from './entities/user_subscription.entity'

const entities = [
  UserEntity,
  ArticleEntity,
  UserSecureEntity,
  SiteEntity,
  UserSubscriptionEntity,
]
const feature = TypeOrmModule.forFeature(entities)
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...MYSQL_DB,
      entities,
      synchronize: true,
    }),
    feature,
  ],
  exports: [feature],
})
export class DatabaseModule {}
