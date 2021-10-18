import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate'
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

  async paginate(options: IPaginationOptions): Promise<Pagination<SiteEntity>> {
    return paginate<SiteEntity>(this.dao, options)
  }

  async getSiteDetailAndTopArticle(siteId: string) {
    const site = await this.siteRepo.findOne(siteId)
    if (!site) {
      throw new BadRequestException('site not found')
    }

    const [top5, articleCount, summary] = await Promise.all([
      this.articleService.dao.find({
        where: { site_id: siteId },
        order: { created_at: 'DESC' },
        take: 5,
      }),
      this.articleService.dao.count({
        where: { site_id: siteId },
      }),
      this.articleService.dao.find({
        where: { site_id: siteId },
        select: ['id', 'title', 'created_at'],
      }),
    ])

    return { ...site, top: top5, articleCount, summary }
  }

  async starSite(siteId: string, userId: string) {
    return this.subscriptionService.subscribe(userId, 'site', siteId)
  }
}
