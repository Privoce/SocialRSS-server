/**
 * 抽取响应体中的 ID 列表, 查询后附加到 `objects`
 * @author Innei <https://innei.ren>
 */

import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { cloneDeep } from 'lodash'
import { map } from 'rxjs'
import { Connection } from 'typeorm'
import { HTTP_ATTACH_QUERY_RELATIVE } from '~/constants/meta.constant'
import { REFLECTOR } from '~/constants/system.constant'

export class QueryRelativeInterceptor implements NestInterceptor {
  constructor(
    private connection: Connection,
    @Inject(REFLECTOR) private refleator: Reflector,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const handler = context.getHandler()
    const meta = this.refleator.get(HTTP_ATTACH_QUERY_RELATIVE, handler)
    console.log(meta)
    if (!meta) {
      return next.handle()
    }

    const { structure, isArray = false } = meta

    if (!structure || !structure.length) {
      return next.handle()
    }
    return next.handle().pipe(
      map((wrapper) => {
        wrapper = cloneDeep(wrapper)
        const data = wrapper.data
        if (Array.isArray(structure)) {
          structure.forEach(([fieldName, type]) => {
            if (isArray) {
              data.forEach((item) => {
                console.log(item)

                console.log(item[fieldName])
              })
            } else {
              data[fieldName]
            }
          })
        }
        return wrapper
      }),
    )
  }
}
