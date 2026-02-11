<template>
  <div class="container mx-auto px-4 py-f-12">
    <div class="lg:w-8/12 mx-auto space-y-5">
      <Button 
        class="flex gap-1 items-center group"
        @click="navigateTo(url)">
        <MoveLeft class="size-5 stroke-2 group-hover:-translate-x-1 duration-300 ease-in-out"/>
        Back to Page
      </Button>
      <h2 class="text-f-2xl text-primary"
        v-if="data.title">
        {{ data.title }}
      </h2>
      <img
        v-if="data.content.image" 
        :src="data.content.image" 
        :alt="data.title"
        class="block w-full">
      <div
        v-if="data.content" 
        v-html="data.content.text">
      </div>
    </div>
  </div>
</template>

<script setup>
  import { MoveLeft } from 'lucide-vue-next'
  const props = defineProps({
    data: Object,
    url: String
  })
</script>

<style scoped>

</style>