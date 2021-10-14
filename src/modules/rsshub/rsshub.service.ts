import { Injectable } from '@nestjs/common'
import { HttpService } from '~/processors/helper/helper.axios'

@Injectable()
export class RSSHubService {
  constructor(private readonly httpService: HttpService) {}

  private readonly rsshubEndpoint = 'https://rsshub.app'

  async getRSSFromRSSHub(url: string) {
    //TODO
    return await this.httpService.$axios
      .request<any>({
        method: 'get',
        url: this.rsshubEndpoint + url,
      })
      .then((data) => data.data)
  }
}
