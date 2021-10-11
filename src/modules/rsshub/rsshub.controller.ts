import { Controller } from '@nestjs/common'
import { RSSHubService } from './rsshub.service'

@Controller('rsshub')
export class RSSHubController {
  constructor(private readonly rsshubService: RSSHubService) {}
}
