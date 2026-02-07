<template>
  <div>
    <DetailCard :data="data" :url="'/main'"/>
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'

  const { params } = useRoute()

  const { getImageById } = useStore()
  
  const data = computed(() => {
    return getImageById(params.id)
  })
</script>

<style scoped>

</style>