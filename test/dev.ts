import { TickTick, createTerminalRenderer } from '../src'

const ti = new TickTick({
  renderer: createTerminalRenderer(),
})

ti.type('Hello This is very cool!\nHello world!\n')
