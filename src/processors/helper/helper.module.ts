import { Global, Module } from '@nestjs/common'
import { HttpService } from './helper.axios'

@Module({
  exports: [HttpService],
  providers: [HttpService],
})
@Global()
export class HelperModule {}
