<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Pages</h1>

    <draggable
      v-model="pageList"
      item-key="id"
      handle=".drag-handle"
      @end="onReorder"
      class="space-y-2 max-w-3xl mb-6">
      <template #item="{ element: p }">
        <div>
          <div class="bg-white border rounded p-4 flex items-center gap-3">
            <GripVertical class="drag-handle size-4 text-muted-foreground cursor-grab shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/admin/pages/${p.id}`" class="font-medium hover:text-primary">
                  {{ p.title }}
                </NuxtLink>
                <span
                  v-if="p.is_home"
                  class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Home
                </span>
              </div>
              <div class="text-sm text-muted-foreground">/{{ p.slug }} · {{ p.components?.length ?? 0 }} blocks</div>
            </div>
            <div class="flex gap-2 shrink-0">
              <NuxtLink :to="`/${p.slug}`" target="_blank">
                <Button variant="ghost" size="sm">View</Button>
              </NuxtLink>
              <Button variant="ghost" size="sm" @click="toggleSettings(p)">
                <Settings class="size-4" />
              </Button>
              <NuxtLink :to="`/admin/pages/${p.id}`">
                <Button size="sm">Edit</Button>
              </NuxtLink>
              <Button variant="ghost" size="sm" @click="askDelete(p)">
                <Trash2 class="size-4" />
              </Button>
            </div>
          </div>

          <div
            v-if="settingsId === p.id"
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
            <div class="pt-1">
              <Button
                v-if="!p.is_home"
                size="sm"
                variant="outline"
                @click="makeHome(p.id)">
                Set as home page
              </Button>
              <p v-else class="text-sm text-muted-foreground">
                ✓ This is the home page (rendered at /)
              </p>
            </div>
            <div class="flex gap-2 pt-1 border-t">
              <Button size="sm" @click="saveSettings(p.id)">Save</Button>
              <Button size="sm" variant="ghost" @click="settingsId = null">Cancel</Button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div class="bg-neutral-100 border rounded p-4 max-w-3xl">
      <div class="text-sm font-medium mb-2">Add a page</div>
      <div class="flex flex-col sm:flex-row gap-2">
        <Input v-model="newTitle" placeholder="Title" class="flex-1" />
        <Input v-model="newSlug" placeholder="slug" class="flex-1" />
        <Button :disabled="!canAdd || adding" @click="addPage">
          {{ adding ? 'Creating…' : '+ Create' }}
        </Button>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete page?"
      :description="deleteMessage"
      confirm-text="Delete"
      @confirm="performDelete" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { GripVertical, Settings, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useStore } from '~/store/store'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const store = useStore()

if (!store.pages.length) await store.getPages()

const pageList = ref([])
const settingsId = ref(null)
const editTitle = ref('')
const editSlug = ref('')
const newTitle = ref('')
const newSlug = ref('')
const adding = ref(false)

const canAdd = computed(() => newTitle.value.trim() && newSlug.value.trim())

watch(
  () => store.pages,
  (pages) => {
    pageList.value = pages ? [...pages] : []
  },
  { immediate: true }
)

function toggleSettings(p) {
  if (settingsId.value === p.id) {
    settingsId.value = null
    return
  }
  settingsId.value = p.id
  editTitle.value = p.title ?? ''
  editSlug.value = p.slug ?? ''
}

async function saveSettings(id) {
  try {
    await store.updatePage(id, {
      title: editTitle.value.trim(),
      slug: editSlug.value.trim(),
    })
    settingsId.value = null
    toast.success('Page updated')
  } catch (e) {
    console.error(e)
    toast.error('Failed to update page')
  }
}

async function makeHome(id) {
  try {
    await store.setAsHome(id)
    toast.success('Home page updated')
  } catch (e) {
    console.error(e)
    toast.error('Failed to set home page')
  }
}

async function addPage() {
  if (!canAdd.value) return
  adding.value = true
  try {
    const created = await store.addPage(newTitle.value.trim(), newSlug.value.trim())
    newTitle.value = ''
    newSlug.value = ''
    toast.success('Page created')
    if (created?.id) await navigateTo(`/admin/pages/${created.id}`)
  } catch (e) {
    console.error(e)
    toast.error('Failed to create page')
  } finally {
    adding.value = false
  }
}

const deleteOpen = ref(false)
const pageToDelete = ref(null)

const deleteMessage = computed(() => {
  const p = pageToDelete.value
  if (!p) return ''
  const blockCount = p.components?.length ?? 0
  return blockCount
    ? `Delete "${p.title}" and its ${blockCount} block${blockCount === 1 ? '' : 's'}? This can't be undone.`
    : `Delete "${p.title}"? This can't be undone.`
})

function askDelete(p) {
  pageToDelete.value = p
  deleteOpen.value = true
}

async function performDelete() {
  const p = pageToDelete.value
  if (!p) return
  try {
    await store.deletePage(p.id)
    if (settingsId.value === p.id) settingsId.value = null
    toast.success('Page deleted')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete page')
  } finally {
    pageToDelete.value = null
  }
}

async function onReorder() {
  const updates = pageList.value.map((p, i) => ({ id: p.id, sort: i + 1 }))
  try {
    await store.reorderPages(updates)
    toast.success('Reordered')
  } catch (e) {
    console.error(e)
    toast.error('Reorder failed')
  }
}
</script>
