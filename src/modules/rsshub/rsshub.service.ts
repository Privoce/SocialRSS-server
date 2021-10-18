import { forwardRef, Inject, Injectable } from '@nestjs/common'
import RssParser from 'rss-parser'
import { HttpService } from '~/processors/helper/helper.axios'
import { RSSService } from '../rss/rss.service'
@Injectable()
export class RSSHubService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => RSSService))
    private readonly rssService: RSSService,
  ) {}

  private readonly rsshubEndpoint = 'https://rsshub.app'

  async getRSSFromRSSHub(url: string) {
    //TODO
    return await this.httpService.$axios
      .request<any>({
        method: 'get',
        url: this.rsshubEndpoint + url,
      })
      .then((data) => data.data)
      .then(async (xml) => {
        const parser = new RssParser()
        const data = await parser.parseString(xml)

        return {
          ...data,
          items: data.items.map((item) =>
            this.rssService.transformParsedItem(item),
          ),
        }
      })
  }
}
