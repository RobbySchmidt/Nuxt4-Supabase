import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { data: tasks, error } = await supabase
    .from('tasks')
    .update({ 
      done: body.done
    })
    .eq('id', body.id)
    .select()
    .single()

  return tasks
})
