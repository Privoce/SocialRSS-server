import { IsEmail, IsString } from 'class-validator'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  @IsString()
  name: string

  @Column({ nullable: true })
  @IsString()
  bio?: string

  @Column({})
  @IsString()
  password: string

  @Column({})
  @IsEmail()
  email: string
}
