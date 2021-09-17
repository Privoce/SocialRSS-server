import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'
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
  @Column({ default: UserRole.User, width: 5 })
  @ApiHideProperty()
  role: UserRole

  @Column({ unique: true, length: 32 })
  @IsString()
  @ApiProperty({
    example: 'innei',
  })
  name: string

  @Column({ nullable: true, length: 150 })
  @IsString()
  @IsOptional()
  bio?: string

  @Column({ length: 64 })
  @IsString()
  password: string

  @Column({ unique: true, length: 150 })
  @IsEmail()
  @ApiProperty({
    example: `${(Math.random() * 100).toString(16).slice(3)}@gmail.com`,
  })
  email: string
}

export class UserEntityPartial extends PartialType(UserEntity) {}
