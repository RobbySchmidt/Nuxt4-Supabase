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

  onMounted(() => {
    const root = document.documentElement

    watch(
      () => [primary_color.value, secondary_color.value, radius.value],
      () => {
        if (primary_color.value) {
          root.style.setProperty('--primary', primary_color.value.color)
        }

        if (secondary_color.value) {
          root.style.setProperty('--secondary', secondary_color.value.color)
        }

        if (radius.value) {
          root.style.setProperty('--radius', `${radius.value.value}px`)
        }
      },
      { immediate: true }
    )
  })


  await Promise.all([
    store.getImages(),
    store.getGeneral(),
    store.getJson(),
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