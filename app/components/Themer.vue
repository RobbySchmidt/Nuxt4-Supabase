<template>
  <Sheet :modal="false">
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

      <h2 
        class="text-foreground font-semibold">
        Edit Components
      </h2>

      <ul class="space-y-3">
        <li
          v-for="component in page?.components"
          :key="component.id"
          class="flex justify-between items-center border py-2 px-3 rounded"
        >
          <span>{{ component.type.type }}</span>

          <Pencil
            class="size-4 cursor-pointer"
            @click="openEditor(component)"
          />
        </li>
      </ul>

      <!-- EDITOR DIALOG -->
      <Dialog v-model:open="editorOpen">
        <DialogContent
          v-if="editedComponent"
          class="sm:max-w-[500px]"
        >
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>
              Update component content
            </DialogDescription>
          </DialogHeader>

          <div class="grid gap-4">

            <!-- SORT -->
            <div class="space-y-2">
              <Label>Sort</Label>
              <Input
                type="number"
                v-model="editedComponent.sort"
              />
            </div>

            <!-- OBJECT CONTENT -->
            <template v-if="isObjectContent">
              <div
                v-for="(value, key) in editedComponent.content"
                :key="key"
                class="space-y-2">
                <Label class="capitalize">{{ key }}</Label>

                <Textarea
                  v-if="key === 'text'"
                  v-model="editedComponent.content[key]"
                />

                <Input
                  v-else
                  v-model="editedComponent.content[key]"
                />
              </div>
            </template>

            <!-- ARRAY CONTENT -->
            <template v-if="isArrayContent">
              <div
                v-for="(item, index) in editedComponent.content"
                :key="index"
                class="border rounded p-3 space-y-2"
              >
                <!-- TITLE (always present) -->
                <Label>Title</Label>
                <Input v-model="item.title" />

                <!-- TEXT ITEM -->
                <template v-if="'text' in item">
                  <Label>Text</Label>
                  <Textarea v-model="item.text" />
                </template>

                <!-- IMAGE ITEM -->
                <template v-else-if="'image' in item">
                  <Label>Image URL</Label>
                  <Input v-model="item.image" />
                </template>
              </div>
            </template>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button @click="saveComponent">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SheetFooter>
        <Button
          @click="store.updateStyle">
          save new style
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup>
  import { Settings2, Pencil } from 'lucide-vue-next'
  import { useStore } from '~/store/store'
  import { storeToRefs } from 'pinia'
  import Textarea from './ui/textarea/Textarea.vue'

  import { toRaw } from 'vue'

  function openEditor(component) {
    editedComponent.value = structuredClone(toRaw(component))
    editorOpen.value = true
  }
  const editorOpen = ref(false)

  const store = useStore()
  const { primary_color, secondary_color, radius } = storeToRefs(store)

  const route = useRoute()
  const page = computed(() => store.getPageBySlug(route.params.slug))

  const editedComponent = ref(null)

  const isArrayContent = computed(() =>
    Array.isArray(editedComponent.value?.content)
  )

  const isObjectContent = computed(() =>
    editedComponent.value &&
    typeof editedComponent.value.content === 'object' &&
    !Array.isArray(editedComponent.value.content)
  )

  async function saveComponent() {
    await store.updateComponent(editedComponent.value)
    editedComponent.value = null
  }
</script>
