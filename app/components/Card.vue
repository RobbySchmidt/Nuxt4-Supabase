<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto grid md:grid-cols-2 gap-8">
      <NuxtLink
        v-if="images"
        v-for="data in images"
        :to="`${slug}/${data.slug}`"
        class="rounded overflow-hidden text-center shadow hover:scale-105 duration-300 ease-in-out">
        <img 
          v-if="data.content.image"
          :src="data.content.image"
          :alt="data.title"
          class="block w-full aspect-5/3 object-cover">
        <h2 
          class="py-1 text-primary text-lg"
          v-if="data.title">
          {{ data.title }}
        </h2>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    slug: String
  })

  import { useStore } from '~/store/store'

  const { images } = useStore()
</script>

<style scoped>

</style>