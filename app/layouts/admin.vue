<template>
  <div class="min-h-screen bg-neutral-50">
    <header class="bg-white border-b sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="font-semibold text-primary">Admin</NuxtLink>
          <nav class="flex gap-4 text-sm">
            <NuxtLink to="/admin" class="hover:text-primary">Pages</NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="text-sm hover:text-primary">View site →</NuxtLink>
          <Button variant="destructive" size="sm" @click="signOut">Logout</Button>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>
