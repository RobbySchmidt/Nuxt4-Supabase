import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { data, error } = await supabase
    .from('components')
    .update({
      content: body.content,
      sort: body.sort
    })
    .eq('id', body.id)
    .select('*, type(type)')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return data
})
