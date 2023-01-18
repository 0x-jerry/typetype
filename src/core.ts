import {
  Promisable,
  PluginManager,
  PromiseInstance,
  createPromiseInstance,
  sleep,
  Optional,
  is,
} from '@0x-jerry/utils'
import { randomRange } from './utils'
import { createTerminalRenderer } from './plugins'

export interface TypeItRenderer {
  split(str: string): Promisable<TypeItemOption[]>
  render(item: TypeItemOption): Promisable<void>
  getDelay?(item: TypeItemOption): Optional<number>
}

export enum TypeItemType {
  Space = 'space',
  Invisible = 'invisible',
  Text = 'text',
}

export interface TypeItemOption {
  type: TypeItemType | string
  content: string
  delay?: number
}

export interface TypeItOption {
  renderer?: TypeItRenderer
  /**
   * @default true
   */
  autoPlay?: boolean
}

export class TypeIt {
  pm = new PluginManager()

  queue: TypeItemOption[] = []

  isPlaying = false

  #ins?: PromiseInstance<void>

  get playing() {
    return this.#ins?.instance
  }

  renderer: TypeItRenderer

  option: Required<Omit<TypeItOption, 'renderer'>>

  constructor(opt: TypeItOption = {}) {
    this.renderer = opt.renderer || createTerminalRenderer()

    this.option = {
      autoPlay: opt.autoPlay ?? true,
    }
  }

  pause() {
    this.isPlaying = false
  }

  play() {
    if (this.isPlaying) return

    this.#play()
  }

  async type(str: string) {
    if (this.option.autoPlay) {
      this.#prepareForPlay()
    }

    const items = await this.renderer.split(str)
    this.queue.push(...items)

    if (this.option.autoPlay) {
      await this.#play()
    }
  }

  async #prepareForPlay() {
    if (this.isPlaying) return

    if (!this.#ins?.isPending) {
      this.#ins = createPromiseInstance()
    }

    this.isPlaying = true
  }

  async #play() {
    while (this.queue.length) {
      // paused
      if (!this.isPlaying) {
        this.#ins?.resolve()
        break
      }

      const item = this.queue.shift()!

      await this.renderer.render(item)

      await sleep(this.#getDelay(item))
    }

    this.#ins?.resolve()
  }

  #getDelay(item: TypeItemOption) {
    const delay = item.delay ?? this.renderer.getDelay?.(item)

    if (!is.nullish(delay)) {
      return delay
    }

    switch (item.type) {
      case 'invisible':
        return 0
      case 'char':
        return randomRange(10, 50)
      case 'space':
        return randomRange(100, 100)

      default:
        return 0
    }
  }
}
