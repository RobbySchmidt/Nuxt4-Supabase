<template>
  <div class="bg-secondary py-f-24">
    <div class="container mx-auto px-4">
      <div class="lg:w-8/12 mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img
          v-if="data.image" 
          :src="data.image" 
          alt=""
          class="rounded overflow-hidden md:order-last">
        <div
          v-if="data.text"
          class="text-lg" 
          v-html="data.text">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    data: Object
  })
</script>

<style scoped>

</style>