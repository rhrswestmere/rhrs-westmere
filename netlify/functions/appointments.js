import { adaptHandler } from './_adapter.js'
import { ok, fail, readBody } from '../../api/_lib/http.js'
import { supabase } from '../../api/_lib/supabase.js'
import { nextAppointmentNo } from '../../api/_lib/ids.js'

async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { full_name, designation, from_date, duration } = body
  if (!full_name || !designation || !from_date || !duration) {
    return fail(res, 400, 'All fields are required')
  }

  const appointment_no = await nextAppointmentNo()

  const { data, error } = await supabase
    .from('appointments')
    .insert({ appointment_no, full_name, designation, from_date, duration })
    .select('*')
    .single()

  if (error) return fail(res, 500, error.message)
  return ok(res, data)
}

export const handler = adaptHandler(handler)
