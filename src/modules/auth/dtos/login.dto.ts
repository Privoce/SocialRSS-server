import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginDto {
  @IsString({ message: '用户名？' })
  @ApiProperty({
    example: 'innei',
  })
  username: string

  @IsString({ message: '密码？' })
  password: string
}
