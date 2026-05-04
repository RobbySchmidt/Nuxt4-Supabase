<template>
  <div class="bg-primary py-f-24">
    <div class="container mx-auto px-4">
      <div class="lg:w-5/12 mx-auto">
        <Accordion 
          type="single" 
          collapsible>
          <AccordionItem
            v-if="content"
            v-for="item in content" 
            :value="item.title">
            <AccordionTrigger 
              v-if="item.title">
              {{ item.title }}
            </AccordionTrigger>
            <AccordionContent>
              <div v-if="item.text"
                v-html="item.text">
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    content: Object
  })
</script>