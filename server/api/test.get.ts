export default defineEventHandler(async () => {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/general` +
    `?select=*,primary_color(color),secondary_color(color),radius(value)`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    }
  )

  const data = await res.json()
  return data[0]
})
