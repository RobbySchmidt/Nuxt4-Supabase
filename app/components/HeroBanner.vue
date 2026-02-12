<template>
  <header class="bg-primary py-f-48">
    <div class="container mx-auto px-4">
      <div class="lg:w-8/12 mx-auto">
        <h1 
          class="font-medium text-f-5xl md:text-f-6xl text-white whitespace-pre-line"
          v-if="content.content.headline">
          {{ content.content.headline }}
        </h1>
      </div>
    </div>
  </header>
</template>

<script setup>
  const props = defineProps({
    content: Object
  })
</script>