import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  NestInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SECURITY } from '~/app.config'
import { UserEntity } from '~/processors/database/entities/user.entity'
import { JWTAuthGuard } from '../guard/auth.guard'

export function Auth() {
  const decorators = []
  if (!SECURITY.skipAuth) {
    decorators.push(UseGuards(JWTAuthGuard))
  } else {
    // fake test user, attach top 1 user into request

    class AttachUser implements NestInterceptor {
      constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
      ) {}
      async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest()
        if (!request.user) {
          const user = await this.userRepo.findOne()
          if (!user) {
            throw new InternalServerErrorException('no user found')
          }
          request.user = user
        }

        return next.handle()
      }
    }
    decorators.push(UseInterceptors(AttachUser))
  }
  decorators.push(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
  return applyDecorators(...decorators)
}
