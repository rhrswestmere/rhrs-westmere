import { adaptHandler } from './_adapter.js'
import { ok, fail, readBody } from '../../api/_lib/http.js'
import { supabase } from '../../api/_lib/supabase.js'
import { nextMemberId } from '../../api/_lib/ids.js'

async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { full_name, address, blood_group, emergency_contact } = body
  if (!full_name || !address || !blood_group || !emergency_contact) {
    return fail(res, 400, 'All fields are required')
  }

  const member_id = await nextMemberId()

  const { data, error } = await supabase
    .from('members')
    .insert({ member_id, full_name, address, blood_group, emergency_contact })
    .select('*')
    .single()

  if (error) return fail(res, 500, error.message)
  return ok(res, data)
}

export const handler = adaptHandler(handler)
