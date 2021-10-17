/* eslint-disable @typescript-eslint/no-empty-function */
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isURL } from 'class-validator'
import RssParser from 'rss-parser'
import { Connection, Repository } from 'typeorm'
import { ArticleEntity } from '~/processors/database/entities/article.entity'
import { SiteEntity } from '~/processors/database/entities/site.entity'

@Injectable()
export class RSSService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(SiteEntity)
    private readonly siteEntity: Repository<SiteEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleEntity: Repository<ArticleEntity>,
  ) {}

  async dispatchRSS(url: string) {
    const controller = new AbortController()
    const id = setTimeout(() => {
      controller.abort()
    }, 8000)

    const xml = await fetch(url, {
      signal: controller.signal,
    })
      .then((res) => res.text())
      .catch((err) => {
        console.log(err)
      })
    clearTimeout(id)
    if (!xml) {
      throw new BadRequestException('RSS not found or timeout')
    }
    const parser = new RssParser()
    const data = await parser.parseString(xml)
    // storage to db
    await this.saveOrUpdateDb(data, url)
    return data
  }

  async saveOrUpdateDb(
    data: {
      [key: string]: any
    } & RssParser.Output<{
      [key: string]: any
    }>,
    url: string,
  ) {
    await this.connection.transaction(async () => {
      const isExist = await this.siteEntity.findOne({ link: url })
      if (isExist) {
        const siteId = isExist.id
        // TODO update db
        await this.connection
          .createQueryBuilder()
          .update(SiteEntity)
          .set({
            desc: data.description,
            title: data.title,
            updated_at: new Date(),
          })
          .where('link = :link', { link: url })
          .execute()

        // 先加入新的
        // 看一下哪些的是新的
        for (const item of data.items) {
          const isExist = await this.articleEntity.findOne({
            link: item.link,
          })
          const { content, description } = this.parseContentFromItem(item)
          if (!isExist) {
            await this.articleEntity.insert({
              title: item.title,
              content,
              description,
              created_at:
                new Date(item.pubDate) || new Date(item.isoDate) || new Date(),
              link: item.link,
              updated_at: new Date(item.isoDate) || new Date(),
              site_id: siteId,
            })
          }
        }

        // 更新原来的
        await Promise.all(
          data.items.map((item) => {
            const { content, description } = this.parseContentFromItem(item)
            this.connection
              .createQueryBuilder()
              .update(ArticleEntity)
              .set({
                title: item.title,
                content,
                description,
                updated_at: new Date(item.isoDate) || new Date(),
              })
              .where('site_id = :site_id and link = :link', {
                site_id: siteId,
                link: item.link,
              })
              .execute()
          }),
        )
      } else {
        const { id } = await this.siteEntity.save({
          created_at: data.lastBuildDate || new Date(),
          desc: data.description,
          link: isURL(data.link, { require_protocol: true }) ? data.link : url,
          title: data.title,
        })

        await Promise.all(
          data.items.map((item) => {
            const { content, description } = this.parseContentFromItem(item)
            return this.articleEntity.insert({
              title: item.title,
              content,
              description,
              created_at:
                new Date(item.pubDate) || new Date(item.isoDate) || new Date(),
              link: item.link,
              updated_at: new Date(item.isoDate) || new Date(),
              site_id: id,
            })
          }),
        )
      }
    })
  }

  private parseContentFromItem(item: { [key: string]: any } & RssParser.Item) {
    const _description = item.description
    const content = item.content ?? item.contentSnippet ?? item.summary
    const description =
      _description == content
        ? (_description?.length > 50
            ? _description?.slice(0, 50)
            : _description) || ''
        : _description
    return { content, description }
  }
}
