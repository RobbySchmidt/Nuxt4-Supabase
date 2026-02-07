import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: primary_colors, error } = await supabase
    .from('primary_colors')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return primary_colors
})
