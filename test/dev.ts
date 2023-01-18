import { TypeIt, createTerminalRenderer } from '../src'

const ti = new TypeIt({
  renderer: createTerminalRenderer(),
})

ti.type('Hello This is very cool!\nHello world!\n')
