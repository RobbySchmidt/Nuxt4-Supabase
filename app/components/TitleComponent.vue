<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <div 
        class="text-f-4xl text-primary font-bold"
        v-if="content.title">
        {{ content.title }}
    </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    content: Object
  })

  console.log(props)
</script>

<style scoped>

</style>