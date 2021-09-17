import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { SiteEntity } from './site.entity'

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @Column({ length: 50 })
  title: string
  @Column({ type: 'longtext' })
  content: string
  @Column()
  link: string
  @Column({ type: 'datetime', nullable: true })
  updated_at?: Date
  @Column()
  @OneToMany((type) => SiteEntity, (site) => site.id)
  site_id: string
}
