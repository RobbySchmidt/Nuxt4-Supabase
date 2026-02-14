import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { data: tasks, error } = await supabase
    .from('tasks')
    .insert([
      { 
        task: body.task 
      },
    ])
  .select()
  .single()

  return tasks
})
