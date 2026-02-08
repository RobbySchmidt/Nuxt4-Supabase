<template>
  <div>
    <pre>{{ general }}</pre>
  </div>
</template>

<script setup>
  const general = await $fetch('/api/test') 

</script>

<style scoped>

</style>