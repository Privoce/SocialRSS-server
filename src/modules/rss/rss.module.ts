import { Module } from '@nestjs/common'
import { RssController } from './rss.controller'
import { RssService } from './rss.service'

@Module({
  controllers: [RssController],
  providers: [RssService],
  exports: [RssService],
})
export class RssModule {}
