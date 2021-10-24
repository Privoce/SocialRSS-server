/**
 * 抽取响应体中的 ID 列表, 查询后附加到 `objects`
 * @author Innei <https://innei.ren>
 */

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Connection } from 'typeorm'

export class QueryRelativeInterceptor implements NestInterceptor {
  constructor(private connection: Connection) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle()
  }
}
