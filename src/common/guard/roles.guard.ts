import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { isDev } from '~/utils/environment.utils'

/**
 * 区分游客和登录态的守卫
 */

@Injectable()
export class GuestCheckGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isMaster = false
    const request = this.getRequest(context)

    if (request.headers['authorization']) {
      try {
        isMaster = (await super.canActivate(context)) as boolean
      } catch (e) {
        if (isDev) {
          console.log(e)
        }
      }
    }
    request.isGuest = !isMaster
    request.isMaster = isMaster
    return true
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}
