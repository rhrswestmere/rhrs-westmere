import { ok, fail, readBody } from './_lib/http.js'
import { supabase } from './_lib/supabase.js'
import { nextMemberId } from './_lib/ids.js'
import { DESIGNATION_QUOTA, padSerial, isValidLevel } from './_lib/designations.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { full_name, address, blood_group, emergency_contact, designation_level, designation_title, designation_state } = body
  if (!full_name || !address || !blood_group || !emergency_contact) {
    return fail(res, 400, 'full_name, address, blood_group, emergency_contact are required')
  }

  let member_id
  try {
    member_id = await nextMemberId()
  } catch (err) {
    return fail(res, 500, err.message)
  }

  const insertData = { member_id, full_name, address, blood_group, emergency_contact }

  const level = String(designation_level || '').trim()
  const title = String(designation_title || '').trim()
  const state = String(designation_state || '').trim()

  let designationWarning = null

  if (level && title && isValidLevel(level)) {
    const { count, error: countErr } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('designation_level', level)

    if (!countErr) {
      const used = count || 0
      if (used < DESIGNATION_QUOTA) {
        insertData.designation_level = level
        insertData.designation_title = title
        insertData.designation_state = state || null
        insertData.designation_number = padSerial(used + 1)
      } else {
        designationWarning = `Quota full for ${level} (${used}/${DESIGNATION_QUOTA}). Member created as Active Member.`
      }
    }
  }

  const { data, error } = await supabase
    .from('members')
    .insert(insertData)
    .select('*')
    .single()

  if (error) return fail(res, 500, error.message)

  if (designationWarning) {
    return ok(res, { ...data, designation_warning: designationWarning })
  }
  return ok(res, data)
}
