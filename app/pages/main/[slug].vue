<template>
  <div>
    <DetailCard :data="data" :url="'/main'"/>
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'

  const { params } = useRoute()

  const { getImageBySlug } = useStore()
  
  const data = computed(() => {
    return getImageBySlug(params.slug)
  })
</script>

<style scoped>

</style>