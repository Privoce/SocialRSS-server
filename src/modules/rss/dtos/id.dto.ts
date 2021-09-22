import { Transform } from 'class-transformer'
import { IsNumberString } from 'class-validator'

export class SiteIdDto {
  @IsNumberString()
  @Transform((value) => String(value))
  siteId: string
}
