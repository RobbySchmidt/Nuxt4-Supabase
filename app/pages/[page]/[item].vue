<template>
  <DetailCard
    v-if="item"
    :item="item"
    :back-url="`/${pageSlug}`" />
  <div
    v-else
    class="container mx-auto px-4 py-f-12 text-center text-muted-foreground">
    Item not found.
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '~/store/store'
import DetailCard from '~/components/DetailCard.vue'

const route = useRoute()
const store = useStore()

const pageSlug = computed(() => route.params.page)
const itemSlug = computed(() => route.params.item)

const item = computed(() => {
  const page = store.getPageBySlug(pageSlug.value)
  if (!page) return null
  for (const block of page.components ?? []) {
    if (block.type?.type !== 'card') continue
    const items = Array.isArray(block.content) ? block.content : []
    const match = items.find(i => i.slug === itemSlug.value)
    if (match) return match
  }
  return null
})
</script>
