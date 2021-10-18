import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'

export class RssDispatchDto {
  @IsUrl({ require_host: true, require_protocol: true })
  @ApiProperty({
    example: 'https://innei.ren/feed',
  })
  url: string
}
