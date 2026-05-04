<template>
  <DynamicPage :page="page" />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '~/store/store'
import DynamicPage from '~/components/DynamicPage.vue'

const store = useStore()
const { homePage: page } = storeToRefs(store)
</script>
