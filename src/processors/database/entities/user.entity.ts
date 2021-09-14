import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

export enum UserRole {
  User,
  Admin,
  SuperAdmin,
  Root,
}
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ default: UserRole.User })
  role: UserRole

  @Column({ unique: true })
  @IsString()
  @ApiProperty({
    example: 'innei',
  })
  name: string

  @Column({ nullable: true })
  @IsString()
  bio?: string

  @Column({})
  @IsString()
  password: string

  @Column({ unique: true })
  @IsEmail()
  email: string
}
