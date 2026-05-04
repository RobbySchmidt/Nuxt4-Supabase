<template>
  <div class="space-y-4">
    <div class="text-sm text-muted-foreground">
      Items shown in this grid. Editing here changes the items everywhere this block type appears.
    </div>

    <draggable
      v-model="itemList"
      item-key="id"
      handle=".drag-handle"
      @end="onReorder"
      class="space-y-2">
      <template #item="{ element: item }">
        <div>
          <div class="bg-white border rounded p-3 flex items-center gap-3">
            <GripVertical class="drag-handle size-4 text-muted-foreground cursor-grab shrink-0" />
            <div class="size-12 rounded overflow-hidden bg-neutral-100 shrink-0">
              <img
                v-if="item.content?.image"
                :src="item.content.image"
                :alt="item.title"
                class="size-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ item.title || '(untitled)' }}</div>
              <div class="text-sm text-muted-foreground truncate">/{{ item.slug }}</div>
            </div>
            <div class="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost" @click="toggleEdit(item)">
                {{ editId === item.id ? 'Close' : 'Edit' }}
              </Button>
              <Button size="sm" variant="ghost" @click="askDelete(item)">
                <Trash2 class="size-4" />
              </Button>
            </div>
          </div>

          <div
            v-if="editId === item.id"
            class="bg-neutral-50 border rounded p-4 mt-2 ml-7 space-y-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <Label>Title</Label>
                <Input v-model="editTitle" />
              </div>
              <div class="space-y-1">
                <Label>Slug</Label>
                <Input v-model="editSlug" />
              </div>
            </div>
            <ImageField v-model="editImage" label="Image" />
            <div class="space-y-1">
              <Label>Text</Label>
              <Textarea v-model="editText" rows="6" />
              <p class="text-xs text-muted-foreground">HTML allowed</p>
            </div>
            <div class="flex gap-2 pt-1 border-t">
              <Button size="sm" @click="saveEdit(item.id)">Save</Button>
              <Button size="sm" variant="ghost" @click="editId = null">Cancel</Button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div class="bg-neutral-100 border rounded p-4 space-y-3">
      <div class="text-sm font-medium">Add an item</div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <Label>Title</Label>
          <Input v-model="newTitle" placeholder="Item title" />
        </div>
        <div class="space-y-1">
          <Label>Slug</Label>
          <Input v-model="newSlug" placeholder="item-slug" />
        </div>
      </div>
      <ImageField v-model="newImage" label="Image" />
      <div class="space-y-1">
        <Label>Text</Label>
        <Textarea v-model="newText" rows="4" />
        <p class="text-xs text-muted-foreground">HTML allowed</p>
      </div>
      <div>
        <Button :disabled="!canAdd || adding" @click="addItem">
          {{ adding ? 'Creating…' : '+ Create' }}
        </Button>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete item?"
      :description="deleteMessage"
      confirm-text="Delete"
      @confirm="performDelete" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { GripVertical, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useStore } from '~/store/store'
import ImageField from './ImageField.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const store = useStore()

onMounted(async () => {
  if (!store.images.length) await store.getImages()
})

const itemList = ref([])
const editId = ref(null)
const editTitle = ref('')
const editSlug = ref('')
const editImage = ref('')
const editText = ref('')

const newTitle = ref('')
const newSlug = ref('')
const newImage = ref('')
const newText = ref('')
const adding = ref(false)

const canAdd = computed(() => newTitle.value.trim() && newSlug.value.trim())

const deleteOpen = ref(false)
const itemToDelete = ref(null)
const deleteMessage = computed(() => {
  const i = itemToDelete.value
  return i ? `Delete "${i.title || '(untitled)'}"? This can't be undone.` : ''
})

watch(
  () => store.images,
  (items) => {
    itemList.value = items ? [...items] : []
  },
  { immediate: true }
)

function toggleEdit(item) {
  if (editId.value === item.id) {
    editId.value = null
    return
  }
  editId.value = item.id
  editTitle.value = item.title ?? ''
  editSlug.value = item.slug ?? ''
  editImage.value = item.content?.image ?? ''
  editText.value = item.content?.text ?? ''
}

async function saveEdit(id) {
  try {
    await store.updateDataItem(id, {
      title: editTitle.value.trim(),
      slug: editSlug.value.trim(),
      image: editImage.value,
      text: editText.value,
    })
    editId.value = null
    toast.success('Item updated')
  } catch (e) {
    console.error(e)
    toast.error('Failed to update item')
  }
}

async function addItem() {
  if (!canAdd.value) return
  adding.value = true
  try {
    await store.addDataItem({
      title: newTitle.value.trim(),
      slug: newSlug.value.trim(),
      image: newImage.value,
      text: newText.value,
    })
    newTitle.value = ''
    newSlug.value = ''
    newImage.value = ''
    newText.value = ''
    toast.success('Item created')
  } catch (e) {
    console.error(e)
    toast.error('Failed to create item')
  } finally {
    adding.value = false
  }
}

function askDelete(item) {
  itemToDelete.value = item
  deleteOpen.value = true
}

async function performDelete() {
  const i = itemToDelete.value
  if (!i) return
  try {
    await store.deleteDataItem(i.id)
    if (editId.value === i.id) editId.value = null
    toast.success('Item deleted')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete item')
  } finally {
    itemToDelete.value = null
  }
}

async function onReorder() {
  const updates = itemList.value.map((it, i) => ({ id: it.id, sort: i + 1 }))
  try {
    await store.reorderData(updates)
    toast.success('Reordered')
  } catch (e) {
    console.error(e)
    toast.error('Reorder failed')
  }
}
</script>
