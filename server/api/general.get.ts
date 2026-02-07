import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { data: general, error } = await supabase
    .from('general')
    .select('*, primary_color(color), secondary_color(color), radius(value)' )
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return general
})
