import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
}
