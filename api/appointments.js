import { ok, fail, readBody } from './_lib/http.js'
import { supabase } from './_lib/supabase.js'
import { nextAppointmentNo } from './_lib/ids.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { full_name, designation, from_date, member_id } = body
  if (!full_name || !designation || !from_date) {
    return fail(res, 400, 'full_name, designation, from_date are required')
  }
  const duration = String(body.duration || '')

  const mid = String(member_id || '').trim()
  if (!mid) {
    return fail(res, 400, 'Member ID (ID card wali) zaroori hai')
  }
  let derived = null
  if (!/^RHRS-\d{4}-\d{4}$/.test(mid)) {
    return fail(res, 400, 'Member ID ka format RHRS-YYYY-NNNN hona chahiye')
  }
  const { data: member } = await supabase
    .from('members')
    .select('member_id')
    .eq('member_id', mid)
    .maybeSingle()
  if (!member) {
    return fail(res, 400, 'Ye Member ID nahi mili — ID card check karke dobara daalein')
  }
  derived = mid.replace(/^RHRS-/, 'RHRS-APT-')

  // Member-linked letter: reuse the member's number. If an appointment with
  // that number already exists it is the same member regenerating the letter,
  // so refresh the row instead of inserting (appointment_no is unique).
  if (derived) {
    const { data: existing } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_no', derived)
      .maybeSingle()

    if (existing) {
      if (String(existing.full_name).trim() === String(full_name).trim()) {
        const { data: updated, error: updateErr } = await supabase
          .from('appointments')
          .update({ full_name, designation, from_date, duration })
          .eq('appointment_no', derived)
          .select('*')
          .single()
        if (updateErr) return fail(res, 500, updateErr.message)
        return ok(res, updated)
      }
      // Number belongs to a different person (legacy data) — fall through and
      // take the next number from the shared series instead.
    } else {
      const { data, error } = await supabase
        .from('appointments')
        .insert({ appointment_no: derived, full_name, designation, from_date, duration })
        .select('*')
        .single()
      if (!error) return ok(res, data)
      if (error.code !== '23505') return fail(res, 500, error.message)
      // Unique violation (race) — fall through to a fresh number.
    }
  }

  // Fresh number from the shared series; retry on rare legacy collisions.
  let lastErr = null
  for (let attempt = 0; attempt < 8; attempt++) {
    let appointment_no
    try {
      appointment_no = await nextAppointmentNo()
    } catch (err) {
      return fail(res, 500, err.message)
    }
    const { data, error } = await supabase
      .from('appointments')
      .insert({ appointment_no, full_name, designation, from_date, duration })
      .select('*')
      .single()
    if (!error) return ok(res, data)
    lastErr = error
    if (error.code !== '23505') break
  }
  return fail(res, 500, lastErr.message)
}
