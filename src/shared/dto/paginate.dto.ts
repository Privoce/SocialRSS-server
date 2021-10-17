import { Transform } from 'class-transformer'
import { IsNumber, Max, Min } from 'class-validator'

export class PaginateDto {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => +value)
  page: number
  @IsNumber()
  @Min(0)
  @Max(50)
  @Transform(({ value }) => +value)
  limit: number
}
