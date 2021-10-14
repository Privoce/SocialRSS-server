import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RSSHubQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/bilibili/bangumi/media/9192' })
  url: string
}
