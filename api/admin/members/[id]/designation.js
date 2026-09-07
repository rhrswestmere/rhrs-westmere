import { ok, fail } from '../../../_lib/http.js'
import { requireAdmin } from '../../../_lib/auth.js'
import { supabase } from '../../../_lib/supabase.js'
import { DESIGNATION_QUOTA, padSerial, isValidLevel } from '../../../_lib/designations.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  const { id } = req.query
  if (!id) return fail(res, 400, 'id is required')

  if (req.method === 'POST') {
    const body = await readBody(req)

    const level = String(body.level || '').trim()
    const title = String(body.title || '').trim()
    const state = String(body.state || '').trim()

    if (!isValidLevel(level)) return fail(res, 400, 'Invalid designation level')
    if (!title) return fail(res, 400, 'designation title is required')

    const { data: member, error: memberErr } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()
    if (memberErr || !member) return fail(res, 404, 'Member not found')

    let designationNumber = member.designation_number
    if (member.designation_level !== level) {
      const { count, error: countErr } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .eq('designation_level', level)
        .neq('id', id)
      if (countErr) return fail(res, 500, countErr.message)

      const used = count || 0
      if (used >= DESIGNATION_QUOTA) {
        return fail(res, 409, `Designation quota full: ${level} already has ${used}/${DESIGNATION_QUOTA} members`)
      }
      designationNumber = padSerial(used + 1)
    }

    const { data, error } = await supabase
      .from('members')
      .update({
        designation_level: level,
        designation_title: title,
        designation_state: state || null,
        designation_number: designationNumber,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'PATCH') {
    const body = await readBody(req)
    const action = body?.action

    if (action === 'status') {
      const isActive = body.is_active
      if (typeof isActive !== 'boolean') return fail(res, 400, 'is_active boolean is required')

      const { data, error } = await supabase
        .from('members')
        .update({ is_active: isActive })
        .eq('id', id)
        .select('*')
        .single()

      if (error) return fail(res, 500, error.message)
      return ok(res, data)
    }

    if (action === 'edit') {
      const { full_name, address, blood_group, emergency_contact, member_id, photo_url, designation_level, designation_title, designation_state } = body

      if (!full_name || !full_name.trim()) return fail(res, 400, 'full_name is required')
      if (!address || !address.trim()) return fail(res, 400, 'address is required')
      if (!blood_group) return fail(res, 400, 'blood_group is required')
      if (!emergency_contact || !emergency_contact.trim()) return fail(res, 400, 'emergency_contact is required')

      const updateData = {
        full_name: full_name.trim(),
        address: address.trim(),
        blood_group,
        emergency_contact: emergency_contact.trim(),
      }

      if (photo_url !== undefined) updateData.photo_url = photo_url || null
      if (member_id !== undefined && member_id.trim()) {
        const { data: existing } = await supabase.from('members').select('member_id').eq('member_id', member_id.trim()).neq('id', id).single()
        if (existing) return fail(res, 409, 'Member ID already exists')
        updateData.member_id = member_id.trim()
      }

      if (designation_level !== undefined) updateData.designation_level = designation_level || null
      if (designation_title !== undefined) updateData.designation_title = designation_title || null
      if (designation_state !== undefined) updateData.designation_state = designation_state || null

      const { data, error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()

      if (error) return fail(res, 500, error.message)
      return ok(res, data)
    }

    return fail(res, 400, 'Invalid action')
  }

  if (req.method === 'DELETE') {
    const body = await readBody(req)
    const action = body?.action

    if (action === 'status') {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) return fail(res, 500, error.message)
      return ok(res, { deleted: true })
    }

    const { data, error } = await supabase
      .from('members')
      .update({
        designation_level: null,
        designation_title: null,
        designation_state: null,
        designation_number: null,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  return fail(res, 405, 'Method not allowed')
}
