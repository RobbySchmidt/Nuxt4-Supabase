import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return tasks
})
