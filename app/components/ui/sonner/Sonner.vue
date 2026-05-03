<script setup lang="ts">
import { Toaster, type ToasterProps } from 'vue-sonner'
import 'vue-sonner/style.css'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Toaster
    class="toaster group"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    }"
    v-bind="props"
  />
</template>
