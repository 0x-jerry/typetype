import { TypeItemOption, TypeItemType, TypeIt } from '../core'

export function createHtmlRenderer() {
  const opt = {
    el: null as null | HTMLElement,
    cache: '',
  }

  const renderer = {
    setup(el: HTMLElement) {
      opt.el = el
    },
    split(str: string) {
      const items: TypeItemOption[] = []

      const d = document.createElement('div')
      d.innerHTML = str

      d.childNodes.forEach((item) => _split(item))

      return items

      function _split(node: Node) {
        if (node.nodeType === document.TEXT_NODE) {
          const nodes = (node.textContent || '').split('').map((n) => {
            return {
              type: /\s/.test(n) ? TypeItemType.Invisible : TypeItemType.Text,
              content: n,
            }
          })

          items.push(...nodes)
          return
        }

        if (node.nodeType === document.ELEMENT_NODE) {
          items.push({
            type: TypeItemType.Invisible,
            content: `<${node.nodeName}>`,
          })

          node.childNodes.forEach((item) => _split(item))

          items.push({
            type: TypeItemType.Invisible,
            content: `</${node.nodeName}>`,
          })

          return
        }
      }
    },
    render(item: TypeItemOption) {
      if (!opt.el) return

      opt.cache += item.content

      opt.el.innerHTML = opt.cache
    },
    clear() {
      opt.cache = ''
    },
  }

  return renderer
}
