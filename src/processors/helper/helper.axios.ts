import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

@Injectable()
export class HttpService {
  #instance: AxiosInstance

  axiosBaseOptions: AxiosRequestConfig = {
    timeout: 5000,
  }

  constructor() {
    this.#instance = axios.create(this.axiosBaseOptions)
  }

  get $axios() {
    return this.#instance
  }
}
