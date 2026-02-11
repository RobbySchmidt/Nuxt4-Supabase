import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return categories
})
