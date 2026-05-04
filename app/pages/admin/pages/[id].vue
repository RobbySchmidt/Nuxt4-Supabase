<template>
  <div v-if="page">
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <NuxtLink to="/admin" class="text-sm text-muted-foreground hover:text-primary">← Pages</NuxtLink>
        <h1 class="text-2xl font-semibold mt-1">{{ page.title }}</h1>
        <div class="text-sm text-muted-foreground">/{{ page.slug }}</div>
      </div>
      <NuxtLink :to="`/${page.slug}`" target="_blank">
        <Button variant="outline">View page →</Button>
      </NuxtLink>
    </div>

    <draggable
      v-model="blocks"
      item-key="id"
      handle=".drag-handle"
      @end="onReorder"
      class="space-y-3 mb-6">
      <template #item="{ element: block }">
        <div>
          <div class="bg-white border rounded p-3 flex items-center gap-3">
            <GripVertical class="drag-handle size-4 text-muted-foreground cursor-grab shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="font-medium">{{ schemaLabel(block) }}</div>
              <div class="text-xs text-muted-foreground truncate">{{ contentPreview(block) }}</div>
            </div>
            <Button size="sm" variant="ghost" @click="toggleEdit(block.id)">
              {{ selectedId === block.id ? 'Close' : 'Edit' }}
            </Button>
            <Button size="sm" variant="ghost" @click="askDeleteBlock(block)">
              <Trash2 class="size-4" />
            </Button>
          </div>
          <div v-if="selectedId === block.id" class="mt-2 ml-7">
            <BlockEditor :block="block" @close="selectedId = null" />
          </div>
        </div>
      </template>
    </draggable>

    <div class="bg-neutral-100 border rounded p-4 max-w-md">
      <div class="text-sm font-medium mb-2">Add a block</div>
      <div class="flex gap-2">
        <Select v-model="newTypeId">
          <SelectTrigger class="flex-1">
            <SelectValue placeholder="Pick a block type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="t in store.types" :key="t.id" :value="t.id">
              {{ blockSchemas[t.type]?.label ?? t.type }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button :disabled="!newTypeId || adding" @click="addBlock">
          {{ adding ? 'Adding…' : 'Add' }}
        </Button>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete block?"
      :description="deleteMessage"
      confirm-text="Delete"
      @confirm="performDeleteBlock" />
  </div>
  <div v-else class="text-muted-foreground">Loading…</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useStore } from '~/store/store'
import { blockSchemas } from '~/lib/blockSchemas'
import BlockEditor from '~/components/admin/BlockEditor.vue'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const store = useStore()

if (!store.pages.length) await store.getPages()
if (!store.types.length) await store.getTypes()

const page = computed(() => store.getPageById(route.params.id))
const blocks = ref([])
const selectedId = ref(null)
const newTypeId = ref(null)
const adding = ref(false)

watch(
  () => page.value?.components,
  (components) => {
    blocks.value = components ? [...components] : []
  },
  { immediate: true, deep: false }
)

function schemaLabel(block) {
  return blockSchemas[block.type?.type]?.label ?? block.type?.type
}

function contentPreview(block) {
  const c = block.content
  if (!c) return '—'
  if (Array.isArray(c)) return `${c.length} item${c.length === 1 ? '' : 's'}`
  if (typeof c === 'object') {
    const first = Object.values(c).find(v => typeof v === 'string' && v.length)
    return first ? String(first).replace(/<[^>]+>/g, '').slice(0, 80) : '—'
  }
  return String(c)
}

function toggleEdit(id) {
  selectedId.value = selectedId.value === id ? null : id
}

async function onReorder() {
  const updates = blocks.value.map((b, i) => ({ id: b.id, sort: i + 1 }))
  try {
    await store.reorderComponents(updates)
    toast.success('Reordered')
  } catch (e) {
    console.error(e)
    toast.error('Reorder failed')
  }
}

async function addBlock() {
  const type = store.types.find(t => t.id === newTypeId.value)
  if (!type) return
  adding.value = true
  try {
    const created = await store.addComponent(page.value.id, type.id, type.type)
    if (created?.id) selectedId.value = created.id
    toast.success(`${blockSchemas[type.type]?.label ?? type.type} added`)
    newTypeId.value = null
  } catch (e) {
    console.error(e)
    toast.error('Failed to add block')
  } finally {
    adding.value = false
  }
}

const deleteOpen = ref(false)
const blockToDelete = ref(null)

const deleteMessage = computed(() => {
  const b = blockToDelete.value
  if (!b) return ''
  return `Delete this ${schemaLabel(b)} block? This can't be undone.`
})

function askDeleteBlock(block) {
  blockToDelete.value = block
  deleteOpen.value = true
}

async function performDeleteBlock() {
  const b = blockToDelete.value
  if (!b) return
  try {
    await store.deleteComponent(b.id)
    if (selectedId.value === b.id) selectedId.value = null
    toast.success('Block deleted')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete block')
  } finally {
    blockToDelete.value = null
  }
}
</script>
