<template>
  <div class="bg-white border rounded p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-muted-foreground">Editing</div>
        <div class="font-semibold">{{ schema?.label ?? block.type?.type }}</div>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="emit('close')">Cancel</Button>
        <Button size="sm" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </Button>
      </div>
    </div>

    <div v-if="!schema">
      <p class="text-sm text-destructive">
        Unknown block type "{{ block.type?.type }}" — no editor schema registered.
      </p>
    </div>

    <div v-else-if="schema.repeater">
      <RepeaterField
        v-model="workingArray"
        :item-schema="schema.item" />
    </div>

    <div v-else-if="!schema.fields?.length">
      <p class="text-sm text-muted-foreground">
        This block has no editable content. It pulls its own data at render time.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="field in schema.fields" :key="field.key" class="space-y-1">
        <template v-if="field.type === 'text'">
          <Label>{{ field.label }}</Label>
          <Input type="text" v-model="working[field.key]" />
          <p v-if="field.hint" class="text-xs text-muted-foreground">{{ field.hint }}</p>
        </template>

        <template v-else-if="field.type === 'textarea'">
          <Label>{{ field.label }}</Label>
          <Textarea rows="6" v-model="working[field.key]" />
          <p v-if="field.hint" class="text-xs text-muted-foreground">{{ field.hint }}</p>
        </template>

        <template v-else-if="field.type === 'image'">
          <ImageField :label="field.label" v-model="working[field.key]" />
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useStore } from '~/store/store'
import { blockSchemas } from '~/lib/blockSchemas'
import ImageField from './ImageField.vue'
import RepeaterField from './RepeaterField.vue'

const props = defineProps({
  block: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const store = useStore()
const saving = ref(false)

const schema = computed(() => blockSchemas[props.block.type?.type])

const working = ref(cloneContent(props.block.content, schema.value))

const workingArray = computed({
  get: () => Array.isArray(working.value) ? working.value : [],
  set: (val) => { working.value = val },
})

watch(() => props.block.id, () => {
  working.value = cloneContent(props.block.content, schema.value)
})

function cloneContent(content, s) {
  if (content !== null && content !== undefined) return JSON.parse(JSON.stringify(content))
  if (!s) return {}
  return JSON.parse(JSON.stringify(s.initial))
}

async function save() {
  saving.value = true
  try {
    await store.updateComponent(props.block.id, working.value)
    toast.success('Block saved')
    emit('close')
  } catch (e) {
    console.error(e)
    toast.error('Failed to save block')
  } finally {
    saving.value = false
  }
}
</script>
