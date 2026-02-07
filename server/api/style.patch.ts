import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { primary_color, secondary_color, radius, id } = body

  const { data: style, error } = await supabase
    .from('general')
    .update({ 
      primary_color, 
      secondary_color, 
      radius 
    })
    .eq('id', id)

  return style
})
