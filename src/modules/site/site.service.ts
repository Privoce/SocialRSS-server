import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SiteEntity } from '~/processors/database/entities/site.entity'
import { ArticleService } from '../article/article.service'
import { SubscriptionService } from '../subscription/subscription.service'

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepo: Repository<SiteEntity>,

    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,

    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public get dao() {
    return this.siteRepo
  }

  async getAllArticlesBySiteId(siteId: string) {
    const site = await this.siteRepo.findOne(siteId)
    if (!site) {
      throw new BadRequestException('site not found')
    }
    return await this.articleService.dao.find({
      where: { site_id: siteId },
      order: { created_at: 'DESC' },
    })
  }

  async starSite(siteId: string, userId: string) {
    return this.subscriptionService.subscribe(userId, 'site', siteId)
  }
}
