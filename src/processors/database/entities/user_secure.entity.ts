import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({ name: 'user_secure' })
export class UserSecureEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: string

  @Column({ type: 'int', width: 10 })
  @OneToOne((type) => UserEntity, (user) => user.id)
  user_id: string

  @Column()
  agent: string

  @Column({ nullable: false, length: 8 })
  auth_code: string

  @Column({ type: 'datetime', nullable: true })
  last_login?: Date

  @Column({ nullable: false })
  ip: string
}
