import { forwardRef, Module } from '@nestjs/common'
import { RSSModule } from '../rss/rss.module'
import { RSSHubController } from './rsshub.controller'
import { RSSHubService } from './rsshub.service'

@Module({
  controllers: [RSSHubController],
  exports: [RSSHubService],
  providers: [RSSHubService],
  imports: [forwardRef(() => RSSModule)],
})
export class RSSHubModule {}
