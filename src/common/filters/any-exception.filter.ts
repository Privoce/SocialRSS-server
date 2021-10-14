import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyReply, FastifyRequest } from 'fastify'
import { WriteStream } from 'fs'
import { HTTP_REQUEST_TIME } from '~/constants/meta.constant'
import { REFLECTOR } from '~/constants/system.constant'
import { isDev } from '~/utils/environment.utils'
import { getIp } from '../../utils/ip.util'
import { LoggingInterceptor } from '../interceptors/logging.interceptor'

type myError = {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('捕获异常')
  private readonly errorLogPipe: WriteStream
  constructor(@Inject(REFLECTOR) private reflector: Reflector) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as myError)?.status ||
          (exception as myError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR
    if (isDev || status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception)
    } else {
      const ip = getIp(request)
      this.logger.warn(
        `IP: ${ip} 错误信息: (${status}) ${
          (exception as any)?.response?.message ||
          (exception as myError)?.message ||
          ''
        } Path: ${decodeURI(request.raw.url)}`,
      )
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.errorLogPipe.write(
          `[${new Date().toISOString()}] ${decodeURI(request.raw.url)}: ${
            (exception as any)?.response?.message ||
            (exception as myError)?.message
          }\n` + (exception as Error).stack,
        )
      }
    }
    // @ts-ignore
    const prevRequestTs = this.reflector.get(HTTP_REQUEST_TIME, request as any)

    if (prevRequestTs) {
      const content = request.method + ' -> ' + request.url
      Logger.debug(
        '--- 响应请求：' + content + ` +${+new Date() - prevRequestTs}ms`,
        LoggingInterceptor.name,
      )
    }

    response
      .status(status)
      .type('application/json')
      .send({
        ok: 0,
        message:
          (exception as any)?.response?.message ||
          (exception as any)?.message ||
          '未知错误',
      })
  }
}
