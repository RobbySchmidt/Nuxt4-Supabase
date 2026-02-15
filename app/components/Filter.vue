<template>
  <div class="container mx-auto px-4 py-f-24">
    <div class="lg:w-8/12 mx-auto">
      <div class="space-x-2 space-y-2">
        <Button
          @click="btnValue = null">
          All
        </Button>
        <Button
          v-if="categories" 
          v-for="btn in categories"
          :key="btn.id"
          @click="btnValue = btn.id">
          {{ btn.name }}
        </Button>
      </div>
      <ul class="border rounded">
        <li 
          v-if="filteredItems"
          v-for="item in filteredItems"
          :key="item.id"
          class="px-4 py-4 border-b last:border-b-0 flex gap-2 justify-between">
          <span>{{ item.item }}</span>
          <span>
            {{ item.categories.map(i => i.name).join(', ') }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  const categories = ref([
    { id: '1654a84f-0d88-4a74-a8eb-4d314d1e4da4', name: 'Nature'},
    { id: 'd7fe17c9-c8f2-46cb-b429-add88409c94a', name: 'Music'},
    { id: 'f1920d71-2453-448b-9f49-afaadadeb98c', name: 'Science'},
  ])
  const items = ref([
    { id: '1971d39c-312a-4f7a-82b6-61bf60953916', item: 'Item-1', categories: [{ id: '1654a84f-0d88-4a74-a8eb-4d314d1e4da4', name: 'Nature'}, { id: 'd7fe17c9-c8f2-46cb-b429-add88409c94a', name: 'Music'}]},
    { id: 'd8bb9edb-ac4f-4007-af55-9f83e6f17571', item: 'Item-2', categories: [{ id: 'd7fe17c9-c8f2-46cb-b429-add88409c94a', name: 'Music'}]},
    { id: '8a50b838-abf7-458e-85b1-bfd815546221', item: 'Item-3', categories: [{ id: '1654a84f-0d88-4a74-a8eb-4d314d1e4da4', name: 'Nature'}, { id: 'f1920d71-2453-448b-9f49-afaadadeb98c', name: 'Science'}]},
  ])

  const btnValue = ref(null)

  const filteredItems = computed(() => {
    if(!btnValue.value) return items.value
    
    return items.value.filter(i => i.categories?.some(c => c.id === btnValue.value))
  })
</script>