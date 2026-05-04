<template>
  <div class="container mx-auto px-4 py-f-12">
    <div class="lg:w-8/12 mx-auto space-y-5">
      <Button
        class="flex gap-1 items-center group"
        @click="navigateTo(backUrl)">
        <MoveLeft class="size-5 stroke-2 group-hover:-translate-x-1 duration-300 ease-in-out" />
        Back to Page
      </Button>
      <h2
        v-if="item.title"
        class="text-f-2xl text-primary">
        {{ item.title }}
      </h2>
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        class="block w-full" />
      <div
        v-if="item.text"
        v-html="item.text">
      </div>
    </div>
  </div>
</template>

<script setup>
import { MoveLeft } from 'lucide-vue-next'

defineProps({
  item: { type: Object, required: true },
  backUrl: { type: String, required: true },
})
</script>
