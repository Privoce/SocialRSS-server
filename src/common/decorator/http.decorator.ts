import { SetMetadata } from '@nestjs/common'
import {
  HTTP_ATTACH_QUERY_RELATIVE,
  HTTP_RES_TRANSFORM_PAGINATE,
} from '~/constants/meta.constant'
import * as SYSTEM from '~/constants/system.constant'

export const Paginator: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata(HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value)
}

/**
 * @description 跳过响应体处理
 */
export const Bypass: MethodDecorator = (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  SetMetadata(SYSTEM.RESPONSE_PASSTHROUGH_METADATA, true)(descriptor.value)
}
/**
 * Response:
 * ```
 * {
 *  data: [
 *    {
 *    user: '1'
 *    }
 *  ]
 * }
 *
 *
 * {
 *  data: {
 *   user: ['1']
 *   }
 * }
 * ```
 *
 *
 * @param field
 * @returns
 */
type Type = string
type FieldName = string
type Field = [FieldName, Type]
export const QueryRelative =
  (structure: Field[], isArray = false) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(HTTP_ATTACH_QUERY_RELATIVE, { structure, isArray })(
      descriptor.value,
    )
  }

export declare interface FileDecoratorProps {
  description: string
}

export const HTTPDecorators = {
  Paginator,
  Bypass,
  QueryRelative,
}
