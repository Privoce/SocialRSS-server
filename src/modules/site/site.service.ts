import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SiteEntity } from '~/processors/database/entities/site.entity'
import { ArticleService } from '../article/article.service'

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly siteRepo: Repository<SiteEntity>,

    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}

  public get dao() {
    return this.siteRepo
  }

  async getAllArticlesBySiteId(siteId: string) {
    return await this.articleService.dao.find({
      where: { site_id: siteId },
      order: { created_at: 'DESC' },
    })
  }
}
