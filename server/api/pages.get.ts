import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return pages
})
