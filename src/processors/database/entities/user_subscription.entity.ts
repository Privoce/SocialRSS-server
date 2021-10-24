import { Column, Entity, OneToOne } from 'typeorm'
import { ArticleEntity } from './article.entity'
import { BaseEntity } from './base.entity'
import { SiteEntity } from './site.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'user_subscription' })
export class UserSubscriptionEntity extends BaseEntity {
  @Column({ nullable: true, type: 'int' })
  @OneToOne((type) => SiteEntity, (site) => site.id)
  site_id?: string // ! <- 先弄它

  @Column({ nullable: true, type: 'int' })
  @OneToOne((type) => ArticleEntity, (article) => article.id)
  article_id?: string // ! <- 先弄它

  @Column({ nullable: true, type: 'int' })
  srss_id?: string // 先放一边

  @Column({ nullable: true, type: 'int' })
  //TODO
  email_id?: string // 先放一边

  @Column({ nullable: false, type: 'int' })
  @OneToOne((type) => UserEntity, (user) => user.id)
  user_id: string
}
