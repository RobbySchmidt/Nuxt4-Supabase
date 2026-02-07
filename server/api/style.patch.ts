import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { data: style, error } = await supabase
    .from('general')
    .update({ 
      primary_color: body.primary_color, 
      secondary_color: body. secondary_color, 
      radius: body.radius
    })
    .eq('id', body.id)
    .select()
    .single()

  return style
})
