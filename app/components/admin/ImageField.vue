<template>
  <div class="space-y-2">
    <Label v-if="label">{{ label }}</Label>

    <div
      v-if="modelValue"
      class="relative w-full max-w-sm rounded border overflow-hidden bg-neutral-100">
      <img :src="modelValue" :alt="label" class="block w-full aspect-video object-cover" />
      <button
        type="button"
        class="absolute top-1 right-1 rounded bg-black/60 text-white p-1 hover:bg-black/80"
        @click="emit('update:modelValue', '')">
        <X class="size-4" />
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="https://… or upload below"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)" />
      <div class="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="uploading"
          @click="fileInput?.click()">
          <Upload class="size-4" />
          {{ uploading ? 'Uploading…' : 'Upload' }}
        </Button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const uploading = ref(false)

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    const { url } = await $fetch('/api/upload', { method: 'POST', body: form })
    emit('update:modelValue', url)
    toast.success('Image uploaded')
  } catch (err) {
    console.error(err)
    toast.error('Upload failed')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>
