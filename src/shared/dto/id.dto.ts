import { Transform } from 'class-transformer'
import { IsNumberString } from 'class-validator'

export class IdDto {
  @IsNumberString()
  @Transform(({ value }) => String(value))
  id: string
}
