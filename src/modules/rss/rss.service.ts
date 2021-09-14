/* eslint-disable @typescript-eslint/no-empty-function */
import { BadRequestException, Injectable } from '@nestjs/common'
import RssParser from 'rss-parser'
@Injectable()
export class RssService {
  constructor() {}

  async dispatchRss(url: string) {
    const xml = await fetch(url)
      .then((res) => res.text())
      .catch((err) => {})
    if (!xml) {
      throw new BadRequestException('RSS not found')
    }
    const parser = new RssParser()
    const data = parser.parseString(xml)

    return data
  }
}
