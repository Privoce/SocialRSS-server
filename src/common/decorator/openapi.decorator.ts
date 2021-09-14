import { ApiTags } from '@nestjs/swagger'
import { isDev } from '~/utils/environment.utils'

export const ApiName: ClassDecorator = (target) => {
  if (!isDev) {
    return
  }
  const [name] = target.name.split('Controller')
  ApiTags(name + ' Routes').call(null, target)
}
