<template>
  <div class="relative -mt-12">
    <header
      v-if="user" 
      class="shadow py-4 sticky top-0 bg-white">
      <div class="container mx-auto px-4">
        <div class="lg:w-8/12 mx-auto flex justify-between items-center">
          <nav>
            <ul class="flex gap-4">
              <li
                v-if="pages"
                v-for="item in pages">
                <NuxtLink 
                  :to="'/' + item.slug"
                  class="hover:text-primary duration-300 ease-in-out"
                  :class="$route.path.startsWith('/' + item.slug) ? 'text-primary' : 'text-black'">
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <Button
            @click="signOut"
            variant="destructive">
            Logout
          </Button>
        </div>
      </div>
    </header>
    <div 
      v-if="user"
      class="sticky top-24 pr-4 ml-auto w-fit">
      <Themer />
    </div>
    <slot />
  </div>
</template>

<script setup>
  import { useStore } from '~/store/store'

  const supabase = useSupabaseClient()

  const user = useSupabaseUser()

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    navigateTo('/login')
  }

  const { pages } = useStore()
</script>

<style scoped>

</style>