import { Transform } from 'class-transformer'
import { IsEnum, Matches } from 'class-validator'

export enum SubscriptionType {
  Website = 'website',
  Email = 'email',
  RSS = 'srss',
  Article = 'article',
}
export class SubscriptionParamDto {
  @IsEnum(SubscriptionType)
  type: SubscriptionType

  @Matches(/\d*/, { each: true })
  @Transform(({ value }) => {
    return value.split(',')
  })
  ids: string[]
}
