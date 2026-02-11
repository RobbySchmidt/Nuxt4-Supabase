import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: items, error } = await supabase
    .from('items')
    .select('*, categories: join_table(category(*))')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return items
})
