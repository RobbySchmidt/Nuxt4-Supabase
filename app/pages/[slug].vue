<template>
  <div class="pb-f-24 space-y-f-24">
    <component
      v-if="page.components"
      v-for="block in page.components"
      :key="block.sort"
      :is="components[block.type?.type]"
      :content="block.content"
    />
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'

  const { params } = useRoute()

  const { getPageBySlug } = useStore()

  const page = computed(() => {
    return getPageBySlug(params.slug)
  })

  const HeroBanner = resolveComponent('HeroBanner')
  const TitleComponent = resolveComponent('TitleComponent')
  const Text = resolveComponent('Text')
  const ImageText = resolveComponent('ImageText')
  const Card = resolveComponent('Card')
  const Categories = resolveComponent('Categories')
  const ImageSlider = resolveComponent('ImageSlider')
  const AccordionComponent = resolveComponent('AccordionComponent')

  const components = {
    herobanner: HeroBanner,
    title: TitleComponent,
    text: Text,
    imageText: ImageText,
    card: Card,
    categories: Categories,
    imageSlider: ImageSlider,
    accordion: AccordionComponent,
  }
</script>

<style scoped>

</style>