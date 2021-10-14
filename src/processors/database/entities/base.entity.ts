import { ApiHideProperty } from '@nestjs/swagger'
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  @ApiHideProperty()
  id: string
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // 需要新版 SQL 支持
  @ApiHideProperty()
  created_at: Date

  @DeleteDateColumn()
  deleted_at?: Date
}
