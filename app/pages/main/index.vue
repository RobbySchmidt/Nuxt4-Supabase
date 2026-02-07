<template>
  <div class="pb-f-24 space-y-f-24">
    <HeroBanner :title="page.content.title" />
    <Headline :headline="page.content.headline" />
    <Text :text="page.content.text"/>
    <ImageText :data="page.content.imageText"/>
    <Card :data="images" :link="page.slug"/>  
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'

  const route = useRoute()

  const { images, getPageByName } = useStore()

  const page = computed(() => {
    return getPageByName(route.name)
  })
</script>

<style scoped>

</style>