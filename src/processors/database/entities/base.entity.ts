import { ApiHideProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiHideProperty()
  id: string
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiHideProperty()
  created_at: Date
}
