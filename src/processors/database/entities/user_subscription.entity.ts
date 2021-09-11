import { Column, Entity, OneToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { SiteEntity } from './site.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'user_subscription' })
export class UserSubscriptionEntity extends BaseEntity {
  @Column({ nullable: true, type: 'bigint' })
  @OneToOne((type) => SiteEntity, (site) => site.id)
  site_id?: string // ! <- 先弄它

  @Column({ nullable: true, type: 'bigint' })
  srss_id?: string // 先放一边

  @Column({ nullable: true, type: 'bigint' })
  //TODO
  email_id?: string // 先放一边

  @Column({ nullable: false, type: 'bigint' })
  @OneToOne((type) => UserEntity, (user) => user.id)
  user_id: string
}
