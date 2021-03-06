import { IsString, IsUrl } from 'class-validator'
import { Column, Entity, OneToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'sites' })
export class SiteEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsString()
  title: string

  @Column({ type: 'text', nullable: true })
  @IsString()
  desc?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsUrl({ require_protocol: true })
  image?: string

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsUrl({ require_protocol: true })
  link: string

  @Column({ type: 'datetime', nullable: true })
  updated_at?: Date

  // user id
  @OneToOne((type) => UserEntity, (user) => user.id)
  @Column({ type: 'bigint', nullable: false })
  owner_id: string
}
