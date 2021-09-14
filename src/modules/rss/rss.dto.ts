import { IsUrl } from 'class-validator'

export class RssDispatchDto {
  @IsUrl({ require_host: true, require_protocol: true })
  url: string
}
