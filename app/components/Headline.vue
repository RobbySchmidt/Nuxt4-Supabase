<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <h2 
        class="text-f-4xl text-primary font-bold"
        v-if="content.content.headline">
        {{ content.content.headline }}
      </h2>
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