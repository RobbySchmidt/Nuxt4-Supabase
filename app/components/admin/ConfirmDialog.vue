<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" @click="emit('update:open', false)">{{ cancelText }}</Button>
        <Button :variant="confirmVariant" @click="onConfirm">{{ confirmText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  title: { type: String, required: true },
  description: String,
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  confirmVariant: { type: String, default: 'destructive' },
})

const emit = defineEmits(['update:open', 'confirm'])

function onConfirm() {
  emit('confirm')
  emit('update:open', false)
}
</script>
