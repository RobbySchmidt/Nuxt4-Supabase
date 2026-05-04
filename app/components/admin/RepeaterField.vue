<template>
  <div class="space-y-3">
    <draggable
      :model-value="modelValue"
      item-key="__index"
      handle=".drag-handle"
      @update:model-value="emit('update:modelValue', $event)"
      class="space-y-3">
      <template #item="{ element: item, index }">
        <div class="bg-neutral-50 border rounded p-3 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <GripVertical class="drag-handle size-4 text-muted-foreground cursor-grab" />
              <span class="text-sm font-medium">Item {{ index + 1 }}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="removeItem(index)">
              <Trash2 class="size-4" />
            </Button>
          </div>

          <div v-for="field in itemSchema.fields" :key="field.key" class="space-y-1">
            <template v-if="field.type === 'text'">
              <Label>{{ field.label }}</Label>
              <Input type="text" v-model="item[field.key]" />
              <p v-if="field.hint" class="text-xs text-muted-foreground">{{ field.hint }}</p>
            </template>

            <template v-else-if="field.type === 'textarea'">
              <Label>{{ field.label }}</Label>
              <Textarea rows="4" v-model="item[field.key]" />
              <p v-if="field.hint" class="text-xs text-muted-foreground">{{ field.hint }}</p>
            </template>

            <template v-else-if="field.type === 'image'">
              <ImageField :label="field.label" v-model="item[field.key]" />
            </template>
          </div>
        </div>
      </template>
    </draggable>

    <Button type="button" variant="outline" size="sm" @click="addItem">
      <Plus class="size-4" />
      Add item
    </Button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { GripVertical, Plus, Trash2 } from 'lucide-vue-next'
import ImageField from './ImageField.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  itemSchema: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

function addItem() {
  const next = [...(props.modelValue ?? []), JSON.parse(JSON.stringify(props.itemSchema.initial))]
  emit('update:modelValue', next)
}

function removeItem(index) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}
</script>
