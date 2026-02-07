<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <div class="text-lg max-w-2xl"
        v-if="text" 
        v-html="text">
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    text: String
  })
</script>

<style scoped>

</style>