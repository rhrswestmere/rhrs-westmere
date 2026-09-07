import { ok, fail, readBody } from '../_lib/http.js'
import { requireAdmin } from '../_lib/auth.js'
import { supabase } from '../_lib/supabase.js'

async function recent(table, limit = 10) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

async function filteredReport(table, from, to, page = 1, limit = 50) {
  const offset = (page - 1) * limit
  let query = supabase.from(table).select('*', { count: 'exact' })
  let countQuery = supabase.from(table).select('id', { count: 'exact', head: true })

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
  if (error) throw error

  const totalCount = count ?? data.length
  return { rows: data, total: totalCount, page, totalPages: Math.ceil(totalCount / limit) }
}

async function donationSummary(from, to) {
  let query = supabase.from('payments').select('amount')
  if (from) query = query.gte('created_at', from)
  if (to) {
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    query = query.lte('created_at', toDate.toISOString())
  }
  const { data, error } = await query
  if (error) throw error
  const totalAmount = (data || []).reduce((sum, r) => sum + Number(r.amount || 0), 0)
  return { totalDonations: data.length, totalAmount }
}

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    try {
      const [members, appointments, payments] = await Promise.all([
        recent('members'),
        recent('appointments'),
        recent('payments'),
      ])
      return ok(res, { members, appointments, payments })
    } catch (err) {
      return fail(res, 500, err.message)
    }
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const reportType = body?.type
    const from = body?.from || null
    const to = body?.to || null
    const page = Math.max(1, parseInt(body?.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(body?.limit) || 50))

    try {
      if (reportType === 'members') {
        const report = await filteredReport('members', from, to, page, limit)
        return ok(res, { type: 'members', from, to, ...report })
      }
      if (reportType === 'donations') {
        const [report, summary] = await Promise.all([
          filteredReport('payments', from, to, page, limit),
          donationSummary(from, to),
        ])
        return ok(res, { type: 'donations', from, to, ...report, summary })
      }
      if (reportType === 'requests') {
        let query = supabase
          .from('payments')
          .select('*', { count: 'exact' })
          .eq('status', 'pending')
          .not('requested_level', 'is', null)
        if (from) query = query.gte('created_at', from)
        if (to) {
          const toDate = new Date(to)
          toDate.setHours(23, 59, 59, 999)
          query = query.lte('created_at', toDate.toISOString())
        }
        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1)
        if (error) throw error
        const total = count ?? data.length
        return ok(res, { type: 'requests', from, to, rows: data, total, page, totalPages: Math.ceil(total / limit) })
      }
      return fail(res, 400, 'Invalid report type. Use "members", "donations", or "requests".')
    } catch (err) {
      return fail(res, 500, err.message)
    }
  }

  if (req.method === 'PATCH') {
    const body = await readBody(req)
    const action = body?.action
    if (action === 'reject') {
      const paymentId = body?.id
      if (!paymentId) return fail(res, 400, 'Payment ID is required')
      const { data, error } = await supabase
        .from('payments')
        .update({ status: 'rejected' })
        .eq('id', paymentId)
        .eq('status', 'pending')
        .select('*')
        .single()
      if (error) return fail(res, 500, error.message)
      return ok(res, data)
    }
    return fail(res, 400, 'Invalid action')
  }

  return fail(res, 405, 'Method not allowed')
}
