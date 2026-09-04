import { adaptHandler } from '../_adapter.js'
import { ok, fail, readBody } from '../../../api/_lib/http.js'
import { requireAdmin } from '../../../api/_lib/auth.js'
import { supabase } from '../../../api/_lib/supabase.js'

async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const { q } = body

    let query = supabase.from('members').select('*').order('created_at', { ascending: false }).limit(50)

    if (q) {
      query = query.or(`full_name.ilike.%${q}%,member_id.ilike.%${q}%`)
    }

    const { data, error } = await query
    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  return fail(res, 405, 'Method not allowed')
}

export const handler = adaptHandler(handler)
