declare global {
  export type KV<T = any> = Record<string, T>

  export { Repository } from 'typeorm'
}

export {}
