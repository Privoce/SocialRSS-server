import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { __secret } from './auth.module'
import { AuthService } from './auth.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: __secret,
      ignoreExpiration: false,
    } as StrategyOptions)
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.verifyPayload(payload)
    if (user) {
      Object.assign(user, { payload })
      return user
    }

    throw new UnauthorizedException('身份已过期')
  }
}
