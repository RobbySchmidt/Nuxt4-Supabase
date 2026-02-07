<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button 
        variant="secondary">
        <Settings2 />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Theme</SheetTitle>
        <SheetDescription>
          Make changes to colors and border radius.
        </SheetDescription>
      </SheetHeader>
      
      <span>Primary Color</span>
      
      <Select v-model="primary_color">
        <SelectTrigger>
          <SelectValue placeholder="Select a primary color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-if="store.primary_colors"
              v-for="primary in store.primary_colors" 
              :value="primary">
              <span 
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: primary.color }">
              </span>
              <span>{{ primary.color }}</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <span>Secondary Color</span>

      <Select v-model="secondary_color">
        <SelectTrigger>
          <SelectValue placeholder="Select a secondary color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-if="store.secondary_colors"
              v-for="secondary in store.secondary_colors" 
              :value="secondary">
              <span 
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: secondary.color }">
              </span>
              <span>{{ secondary.color }}</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <span>Border Radius</span>

      <Select v-model="radius">
        <SelectTrigger>
          <SelectValue placeholder="Select a border radius" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-if="store.border_radius"
              v-for="radius in store.border_radius" 
              :value="radius">
              <span 
                class="w-2 h-2 rounded-full">
              </span>
              <span>{{ radius.value }}</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <SheetFooter>
        <SheetClose as-child>
          <Button
            @click="store.updateStyle">
            save new style
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup>
  import { Settings2 } from 'lucide-vue-next'
  import { useStore } from '~/store/store'
  import { storeToRefs } from 'pinia'

  const store = useStore()

  const { primary_color, secondary_color, radius } = storeToRefs(store)
</script>