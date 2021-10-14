import { Module } from '@nestjs/common'
import { RSSController } from './rss.controller'
import { RSSService } from './rss.service'

@Module({
  controllers: [RSSController],
  providers: [RSSService],
  exports: [RSSService],
})
export class RSSModule {}
