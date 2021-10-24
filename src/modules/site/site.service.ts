import {
  BadRequestException,
  ForbiddenException,
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
import { Connection, Repository } from 'typeorm'
import { ArticleEntity } from '~/processors/database/entities/article.entity'
import { SiteEntity } from '~/processors/database/entities/site.entity'
import { UserRole } from '~/processors/database/entities/user.entity'
import { ArticleService } from '../article/article.service'
import { SubscriptionType } from '../subscription/subscription.dto'
import { SubscriptionService } from '../subscription/subscription.service'
import { UserService } from '../user/user.service'

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepo: Repository<SiteEntity>,

    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,

    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly connection: Connection,
  ) {}

  public get repo() {
    return this.siteRepo
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<SiteEntity>> {
    return paginate<SiteEntity>(this.repo, options)
  }

  async getSiteDetailAndTopArticle(siteId: string) {
    const site = await this.siteRepo.findOne(siteId)
    if (!site) {
      throw new BadRequestException('site not found')
    }

    const [top5, articleCount, summary] = await Promise.all([
      this.articleService.repo.find({
        where: { site_id: siteId },
        order: { created_at: 'DESC' },
        take: 5,
      }),
      this.articleService.repo.count({
        where: { site_id: siteId },
      }),
      this.articleService.repo.find({
        where: { site_id: siteId },
        select: ['id', 'title', 'created_at'],
      }),
    ])

    return { ...site, top: top5, articleCount, summary }
  }

  async starSite(siteId: string, userId: string) {
    return this.subscriptionService.subscribe(
      userId,
      SubscriptionType.Website,
      siteId,
    )
  }

  async deleteSite(siteId: string, ownerId: string) {
    const user = await this.userService.dao.findOne(ownerId)

    if (!user) {
      throw new BadRequestException('user not found')
    }

    const site = await this.siteRepo.findOne(siteId)
    if (!site) {
      throw new BadRequestException('site not found')
    }
    if (
      site.owner_id !== ownerId &&
      ![UserRole.Admin, UserRole.SuperAdmin, UserRole.Root].includes(user.role)
    ) {
      throw new ForbiddenException('no permission to delete')
    }

    this.connection.transaction(async (manager) => {
      await manager.softDelete(ArticleEntity, { site_id: siteId })
      await manager.softDelete(SiteEntity, { id: siteId })
    })
  }
}
