/* eslint-disable @typescript-eslint/no-empty-function */
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isURL } from 'class-validator'
import RssParser from 'rss-parser'
import { Connection, Repository } from 'typeorm'
import { ArticleEntity } from '~/processors/database/entities/article.entity'
import { SiteEntity } from '~/processors/database/entities/site.entity'

@Injectable()
export class RssService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(SiteEntity)
    private readonly siteEntity: Repository<SiteEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleEntity: Repository<ArticleEntity>,
  ) {}

  async dispatchRss(url: string) {
    const xml = await fetch(url)
      .then((res) => res.text())
      .catch((err) => {})
    if (!xml) {
      throw new BadRequestException('RSS not found')
    }
    const parser = new RssParser()
    const data = await parser.parseString(xml)
    // storage to db
    await this.connection.transaction(async () => {
      // TODO update db
      const { id } = await this.siteEntity.save({
        created_at: data.lastBuildDate || new Date(),
        desc: data.description,
        link: isURL(data.link, { require_protocol: true }) ? data.link : url,
        title: data.title,
      })

      await Promise.all(
        data.items.map((item) => {
          return this.articleEntity.insert({
            title: item.title,
            content: item.content ?? item.contentSnippet,
            created_at: new Date(item.pubDate) || new Date(item.isoDate),
            link: item.link,
            updated_at: new Date(item.isoDate),
            site_id: id,
          })
        }),
      )
    })

    return data
  }
}
