<template>
  <div class="container mx-auto px-4">
    <div class="lg:w-8/12 mx-auto">
      <Carousel 
        class="relative w-full"
        @init-api="setApi"
        :opts="{
          align: 'start',
          loop: true,
        }">
        <CarouselContent>
          <CarouselItem 
            v-for="(image, index) in content" 
            :key="index"
            class="md:basis-1/2 xl:basis-1/3">
            <div class="rounded overflow-hidden" >
              <img 
                :src="image.image" 
                :alt="image.title"
                class="block w-full">
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div class="py-2 text-center text-sm text-muted-foreground">
        Slide {{ current }} of {{ totalCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CarouselApi } from '@/components/ui/carousel'
  import { watchOnce } from '@vueuse/core'
  import { ref } from 'vue'

  defineProps({
    content: Object
  })
  
  const api = ref<CarouselApi>()
  const totalCount = ref(0)
  const current = ref(0)
  
  function setApi(val: CarouselApi) {
    api.value = val
  }
  
  watchOnce(api, (api) => {
    if (!api)
      return
  
    totalCount.value = api.scrollSnapList().length
    current.value = api.selectedScrollSnap() + 1
  
    api.on('select', () => {
      current.value = api.selectedScrollSnap() + 1
    })
  })
</script>