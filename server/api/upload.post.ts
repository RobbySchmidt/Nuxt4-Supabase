import { supabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const file = parts?.find(p => p.name === 'file')

  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const ext = file.filename.split('.').pop() ?? 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('media')
    .upload(path, file.data, {
      contentType: file.type ?? 'application/octet-stream',
      upsert: false,
    })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return { url: data.publicUrl, path }
})
