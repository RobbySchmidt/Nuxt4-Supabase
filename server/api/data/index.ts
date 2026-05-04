import { supabase } from '~~/server/utils/supabase'

type Filter = { column: string; operator: string; value: any }
type Order = { column: string; ascending?: boolean; foreignTable?: string }

interface QueryBody {
  action: 'select' | 'insert' | 'update' | 'delete'
  table: string
  select?: string
  filters?: Filter[]
  order?: Order[]
  limit?: number
  range?: { from: number; to: number }
  single?: boolean
  values?: Record<string, any> | Record<string, any>[]
}

const ALLOWED_OPS = new Set([
  'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
  'like', 'ilike', 'is', 'in', 'contains', 'containedBy',
])

export default defineEventHandler(async (event) => {
  const body = await readBody<QueryBody>(event)

  if (!body?.table || !body?.action) {
    throw createError({ statusCode: 400, statusMessage: 'action and table are required' })
  }

  const base = supabase.from(body.table)
  let query: any

  switch (body.action) {
    case 'select':
      query = base.select(body.select ?? '*')
      break
    case 'insert':
      query = base.insert(body.values as any).select(body.select ?? '*')
      break
    case 'update':
      query = base.update(body.values as any).select(body.select ?? '*')
      break
    case 'delete':
      query = base.delete().select(body.select ?? '*')
      break
    default:
      throw createError({ statusCode: 400, statusMessage: 'invalid action' })
  }

  for (const f of body.filters ?? []) {
    if (!ALLOWED_OPS.has(f.operator)) {
      throw createError({ statusCode: 400, statusMessage: `bad operator: ${f.operator}` })
    }
    query = query[f.operator](f.column, f.value)
  }

  for (const o of body.order ?? []) {
    query = query.order(o.column, {
      ascending: o.ascending ?? true,
      foreignTable: o.foreignTable,
    })
  }

  if (body.range) query = query.range(body.range.from, body.range.to)
  if (body.limit) query = query.limit(body.limit)

  const { data, error } = body.single ? await query.single() : await query

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
