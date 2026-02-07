import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

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
