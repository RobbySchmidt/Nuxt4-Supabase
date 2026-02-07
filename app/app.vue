<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'
  import { storeToRefs } from 'pinia'

  const store = useStore()

  const { primary_color, secondary_color, radius } = storeToRefs(store)

  if (process.client) {
    watchEffect(() => {
      const root = document.documentElement

      if (primary_color.value) {
        root.style.setProperty('--primary', primary_color.value.color)
      }

      if (secondary_color.value) {
        root.style.setProperty('--secondary', secondary_color.value.color)
      }

      if (radius.value !== null) {
        root.style.setProperty('--radius', `${radius.value.value}px`)
      }
    })
  }

  await Promise.all([
    store.getImages(),
    store.getPages(),
    store.getGeneral(),
    store.getPrimaryColors(),
    store.getSecondaryColors(),
    store.getBorderRadius(),
  ])
</script>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.2s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
</style>