import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: border_radius, error } = await supabase
    .from('border_radius')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return border_radius
})
