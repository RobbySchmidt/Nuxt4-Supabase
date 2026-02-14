<template>
  <div class="container mx-auto px-4 py-f-12">
    <div class="lg:w-8/12 mx-auto gap-8">
      <div class="flex items-center gap-4">
        <Input 
          type="text"
          v-model="task" />
        <Button @click="store.addTask">
          add Task
        </Button>
      </div>
      <ul class="py-4 space-y-2">
        <li
          v-if="tasks" 
          v-for="task in tasks"
          class="flex items-center justify-between">
          <span v-if="task">
            {{ task.task }}
          </span>
          <div class="flex items-center gap-1">
            <CircleCheck 
              @click="store.checkTask(task)"
              :class="task.done ? 'text-green-500' : 'text-yellow-500'"/>
            <CircleX 
              @click="store.deleteTask(task.id)"
              class="text-red-500"/>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { CircleCheck, CircleX } from 'lucide-vue-next'
  import { useStore } from '~/store/store'
  import { storeToRefs } from 'pinia'
  const props = defineProps({
    content: Object
  })
  
  const store = useStore()
  const { task, tasks } = storeToRefs(store)

</script>

<style scoped>

</style>