<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <div class="text-lg max-w-2xl"
        v-if="content" 
        v-html="content">
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