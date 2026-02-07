<template>
  <div class="px-4 py-f-12 h-screen flex flex-col justify-center">
    <form 
      @submit.prevent="onSubmit"
      class="space-y-4 w-full max-w-xs mx-auto">
      <FormField 
        v-slot="{ componentField }"
        name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input 
              type="text" 
              placeholder="Email" 
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField 
        v-slot="{ componentField }"
        name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="Password" 
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button 
        type="submit"
        class="w-full">
        Login
      </Button>
    </form>
  </div>
</template>

<script setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { useForm } from 'vee-validate'
  import { z } from 'zod'

  const supabase = useSupabaseClient()

  const formSchema = toTypedSchema(z.object({
    email: z.string().min(2, 'please enter your email address'),
    password: z.string().min(2, 'please enter your password'),
  }))

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!values) return

    try {
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      form.resetForm()
      navigateTo('/main')

    } catch (e) {}
  })
</script>