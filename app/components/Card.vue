<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto grid md:grid-cols-2 gap-8">
      <NuxtLink
        v-for="item in items"
        :key="item.slug"
        :to="`/${pageSlug}/${item.slug}`"
        class="rounded overflow-hidden text-center shadow hover:scale-105 duration-300 ease-in-out">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="block w-full aspect-5/3 object-cover" />
        <h2
          v-if="item.title"
          class="py-1 text-primary text-lg">
          {{ item.title }}
        </h2>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: { type: [Array, Object, null], default: () => [] },
  pageSlug: { type: String, default: '' },
})

const items = computed(() => Array.isArray(props.content) ? props.content : [])
</script>
