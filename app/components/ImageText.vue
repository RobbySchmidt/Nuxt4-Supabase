<template>
  <div class="bg-secondary py-f-24">
    <div class="container mx-auto px-4">
      <div class="lg:w-8/12 mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img
          v-if="content.image" 
          :src="content.image" 
          alt=""
          class="rounded overflow-hidden md:order-last block w-full aspect-5/3 object-cover">
        <div
          v-if="content.text"
          class="text-lg" 
          v-html="content.text">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    content: Object
  })
</script>

<style scoped>

</style>