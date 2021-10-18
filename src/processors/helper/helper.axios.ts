import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { attach } from 'retry-axios'
import { isDev } from '~/utils/environment.utils'

@Injectable()
export class HttpService {
  #instance: AxiosInstance

  axiosBaseOptions: AxiosRequestConfig = {
    timeout: 5000,
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  }

  constructor() {
    this.#instance = axios.create(this.axiosBaseOptions)

    this.#instance.interceptors.response.use(
      (req) => req,
      (err) => {
        console.log(err.message)
      },
    )
    attach(this.#instance)

    this.#instance.defaults.raxConfig = {
      retryDelay: 1000,
      retry: 3,
      onRetryAttempt: (err) => {
        console.log('请求超时, 正在重试...')

        console.log(err.message)
      },
    }

    if (isDev) {
      const SocksProxyAgent = require('socks-proxy-agent')
      const proxyHost = '127.0.0.1',
        proxyPort = 1080
      // the full socks5 address
      const proxyOptions = `socks5://${proxyHost}:${proxyPort}`
      // create the socksAgent for axios
      const httpsAgent = new SocksProxyAgent(proxyOptions)
      this.#instance.defaults.httpsAgent = httpsAgent
    }
  }

  get $axios() {
    return this.#instance
  }
}
