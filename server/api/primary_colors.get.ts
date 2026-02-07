import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

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
