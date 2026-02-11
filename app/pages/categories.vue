<template>
  <div class="py-f-12 px-4 space-y-4">
    <Select v-model="selectedCategory">
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="null">
          all categories
        </SelectItem>
        <SelectItem
          v-if="categories"
          v-for="category in categories"
          :key="category.id"
          :value="category.id">
          {{ category.category }}
        </SelectItem>
      </SelectContent>
    </Select>
    <TransitionGroup 
      name="list" 
      tag="ul" 
      v-if="filteredItems">
      <li 
        v-for="item in filteredItems"
        :key="item.id"
        class="space-x-2">
        <span>{{ item.item }}</span>
        <ul class="flex gap-2 pl-2">
          <li>
            categories:
            <span 
              v-if="item.categories">
              {{ item.categories.map(cat => cat.category.category).join(', ') || 'no categories found' }}
            </span>
          </li>
        </ul>
      </li>
    </TransitionGroup>

    <pre>{{ items }}</pre>
  </div>
</template>

<script setup>
  const { data: items } = await useFetch('/api/items') 
  const { data: categories } = await useFetch('/api/categories')

  const selectedCategory = ref(null)

  const filteredItems = computed(() => {
    if (!items.value) return []

    if (!selectedCategory.value) return items.value

    return items.value.filter(item => 
      item.categories?.some(cat => cat.category.id === selectedCategory.value)
    )
  })
</script>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease-in-out;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
  }
</style>