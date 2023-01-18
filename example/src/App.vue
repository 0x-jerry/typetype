<script setup lang="ts">
import { TypeIt, createHtmlRenderer } from 'ticktick'
import { onMounted, ref } from 'vue'
import { marked } from 'marked'

const el = ref<HTMLElement>()

const renderer = createHtmlRenderer()

const ti = new TypeIt({
  renderer,
})

onMounted(() => {
  renderer.setup(el.value!)
  ti.type(marked('hello, **This is a test**, `very cool`!'))
})
</script>

<template>
  <div>
    <div class="type">Type Test</div>
    <div class="box" ref="el"></div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
