<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto grid md:grid-cols-2 gap-8">
      <NuxtLink
        v-if="data"
        v-for="data in data"
        :to="`/${link}/${data.id}`"
        class="rounded overflow-hidden text-center shadow hover:scale-105 duration-300 ease-in-out">
        <img 
          v-if="data.image"
          :src="data.image"
          :alt="data.title">
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
    data: Array,
    link: String
  })
</script>

<style scoped>

</style>