import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data, error } = await supabase
    .from('data')
    .select('*')
    .order('sort', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return data
})
