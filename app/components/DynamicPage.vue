<template>
  <div class="pb-f-24 space-y-f-24">
    <component
      v-if="page?.components"
      v-for="block in page.components"
      :key="block.id"
      :is="components[block.type?.type]"
      :content="block.content"
      :page-slug="page?.slug" />
  </div>
</template>

<script setup>
defineProps({ page: Object })

const HeroBanner = resolveComponent('HeroBanner')
const TitleComponent = resolveComponent('TitleComponent')
const Text = resolveComponent('Text')
const ImageText = resolveComponent('ImageText')
const Card = resolveComponent('Card')
const Categories = resolveComponent('Categories')
const ImageSlider = resolveComponent('ImageSlider')
const AccordionComponent = resolveComponent('AccordionComponent')
const Tasks = resolveComponent('Tasks')

const components = {
  herobanner: HeroBanner,
  title: TitleComponent,
  text: Text,
  imageText: ImageText,
  card: Card,
  categories: Categories,
  imageSlider: ImageSlider,
  accordion: AccordionComponent,
  tasks: Tasks,
}
</script>
