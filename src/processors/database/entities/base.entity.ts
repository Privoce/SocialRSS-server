import { ApiHideProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiHideProperty()
  id: string
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // 需要新版 SQL 支持
  @ApiHideProperty()
  created_at: Date
}
