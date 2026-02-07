<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <h2 
        class="text-f-4xl text-primary font-bold"
        v-if="headline">
        {{ headline }}
      </h2>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    headline: String
  })
</script>

<style scoped>

</style>