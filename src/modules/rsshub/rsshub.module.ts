import { Module } from '@nestjs/common'
import { RSSHubController } from './rsshub.controller'
import { RSSHubService } from './rsshub.service'

@Module({
  controllers: [RSSHubController],
  exports: [RSSHubService],
  providers: [RSSHubService],
})
export class RSSHubModule {}
