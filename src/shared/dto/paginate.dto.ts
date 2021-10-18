import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, Max, Min } from 'class-validator'

export class PaginateDto {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => +value)
  @ApiProperty({
    type: 'number',
    required: false,
    name: 'page',
  })
  page = 1
  @IsNumber()
  @Min(0)
  @Max(50)
  @Transform(({ value }) => +value)
  @ApiProperty({
    type: 'number',
    required: false,
    name: 'limit',
  })
  limit = 50
}
