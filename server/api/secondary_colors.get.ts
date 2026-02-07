import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: secondary_colors, error } = await supabase
    .from('secondary_colors')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return secondary_colors
})
