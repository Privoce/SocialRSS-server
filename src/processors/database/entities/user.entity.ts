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
  @Column({ default: UserRole.User })
  @ApiHideProperty()
  role: UserRole

  @Column({ unique: true })
  @IsString()
  @ApiProperty({
    example: 'innei',
  })
  name: string

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string

  @Column({})
  @IsString()
  password: string

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({
    example: `${(Math.random() * 100).toString(16).slice(3)}@gmail.com`,
  })
  email: string
}

export class UserEntityPartial extends PartialType(UserEntity) {}
