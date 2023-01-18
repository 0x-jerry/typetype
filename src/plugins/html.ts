import { TypeItRenderer, TypeItemOption } from '../core'

export function createHtmlRenderer() {
  const opt = {
    el: null as null | HTMLElement,
  }

  const renderer = {
    setup(el: HTMLElement) {
      opt.el = el
    },
    split(str: string) {
      const items: TypeItemOption[] = []
      // todo
      return items
    },
    render(item: TypeItemOption) {
      // todo
    },
  }

  return renderer
}
