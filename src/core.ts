import {
  Promisable,
  PromiseInstance,
  createPromiseInstance,
  sleep,
  Optional,
  is,
} from '@0x-jerry/utils'
import { randomRange } from './utils'
import { createTerminalRenderer } from './plugins'

export interface TypeItRenderer {
  split(str: string): Promisable<TypeItem[]>
  render(item: TypeItem, ctx: TypeIt): Promisable<void>
  getDelay?(item: TypeItem): Optional<number>
  clear?(): void
}

export enum TypeItemType {
  Space = 'space',
  Invisible = 'invisible',
  Text = 'text',
}

export interface TypeItem {
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
  queue: TypeItem[] = []

  isPlaying = false

  #ins?: PromiseInstance<void>

  /**
   * current playing index
   */
  cursor = 0

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

    this.#prepareForPlay()
    this.#play()
  }

  async type(str: string) {
    this.clear()

    if (this.option.autoPlay) {
      this.#prepareForPlay()
    }

    const items = await this.renderer.split(str)
    this.queue.push(...items)

    if (this.option.autoPlay) {
      await this.#play()
    }
  }

  clear() {
    this.pause()
    this.cursor = 0
    this.queue = []

    this.renderer.clear?.()
  }

  async #prepareForPlay() {
    if (this.isPlaying) return

    if (!this.#ins?.isPending) {
      this.#ins = createPromiseInstance()
    }

    this.isPlaying = true
  }

  async #play() {
    while (this.cursor < this.queue.length) {
      // paused
      if (!this.isPlaying) {
        this.#ins?.resolve()
        break
      }

      const item = this.queue[this.cursor]

      await this.renderer.render(item, this)

      await sleep(this.#getDelay(item))

      this.cursor++
    }

    this.#ins?.resolve()
  }

  #getDelay(item: TypeItem) {
    const delay = item.delay ?? this.renderer.getDelay?.(item)

    if (!is.nullish(delay)) {
      return delay
    }

    switch (item.type) {
      case TypeItemType.Invisible:
        return 0
      case TypeItemType.Text:
        return randomRange(30, 50)
      case TypeItemType.Space:
        return randomRange(100, 100)

      default:
        return randomRange(10, 50)
    }
  }
}
