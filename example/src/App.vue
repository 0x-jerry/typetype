<script setup lang="ts">
import { TypeIt, createHtmlRenderer } from 'ticktick'
import { onMounted, reactive, ref } from 'vue'
import { marked } from 'marked'

const el = ref<HTMLElement>()

const renderer = createHtmlRenderer()

const ti = new TypeIt({
  renderer,
})

const data = reactive({
  text: 'Hello, **This is a `test`**, `very cool`! ~~and~~ #beautiful! ',
})

onMounted(() => {
  renderer.setup(el.value!)

  type()
})

function type() {
  ti.type(marked(data.text))
}
</script>

<template>
  <div>
    <div class="desc">
      <strong> Type Test </strong>
      <button @click="ti.play()">Play</button>
      <button @click="ti.pause()">Pause</button>
      <button @click="type">Reset</button>
    </div>

    <textarea cols="60" rows="5" v-model="data.text"></textarea>

    <div class="markdown-body" ref="el"></div>
  </div>
</template>

<style scoped>
.desc {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
