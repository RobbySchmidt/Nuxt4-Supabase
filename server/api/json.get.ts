import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: json, error } = await supabase
    .from('json')
    .select('*')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return json
})
