declare global {
  export type KV<T = any> = Record<string, T>

  import type { Repository } from 'typeorm'
  export { Repository }
}

export {}
