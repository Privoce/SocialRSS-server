import { JwtPayload } from '~/modules/auth/interfaces/jwt-payload.interface'
import { UserEntity } from '~/processors/database/entities/user.entity'

export interface UserWithJwt extends UserEntity {
  payload: JwtPayload
}
