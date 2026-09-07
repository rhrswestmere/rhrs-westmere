import { ok, fail, readBody } from '../_lib/http.js'
import { requireAdmin } from '../_lib/auth.js'
import { supabase } from '../_lib/supabase.js'
import { DESIGNATION_LABELS, DESIGNATION_LEVELS, DESIGNATION_QUOTA } from '../_lib/designations.js'

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const q = String(body?.q || '').trim()
  const page = Math.max(1, parseInt(body?.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(body?.limit) || 20))
  const from = body?.from || null
  const to = body?.to || null
  const offset = (page - 1) * limit

  let query = supabase.from('members').select('*', { count: 'exact' })
  let countQuery = supabase.from('members').select('id', { count: 'exact', head: true })

  if (q) {
    const term = `%${q}%`
    const orFilter = `full_name.ilike.${term},emergency_contact.ilike.${term},member_id.ilike.${term}`
    query = query.or(orFilter)
    countQuery = countQuery.or(orFilter)
  }

  if (from) {
    query = query.gte('created_at', from)
    countQuery = countQuery.gte('created_at', from)
  }
  if (to) {
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    query = query.lte('created_at', toDate.toISOString())
    countQuery = countQuery.lte('created_at', toDate.toISOString())
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return fail(res, 500, error.message)

  const totalCount = count ?? data.length
  const totalPages = Math.ceil(totalCount / limit)

  const quotaCounts = {}
  for (const level of DESIGNATION_LEVELS) {
    const { count: c } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('designation_level', level)
    quotaCounts[level] = c || 0
  }

  return ok(res, {
    members: data,
    pagination: { page, limit, total: totalCount, totalPages },
    quota: {
      perLevel: DESIGNATION_QUOTA,
      used: quotaCounts,
      labels: DESIGNATION_LABELS,
    },
  })
}
