import { adaptHandler } from '../_adapter.js'
import { ok, fail } from '../../../api/_lib/http.js'
import { requireAdmin } from '../../../api/_lib/auth.js'
import { supabase } from '../../../api/_lib/supabase.js'

async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return
  if (req.method !== 'GET') return fail(res, 405, 'Method not allowed')

  const [members, appointments, payments] = await Promise.all([
    supabase.from('members').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  return ok(res, {
    members: members.data || [],
    appointments: appointments.data || [],
    payments: payments.data || [],
  })
}

export const handler = adaptHandler(handler)
