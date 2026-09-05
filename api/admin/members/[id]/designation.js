import { ok, fail } from '../../_lib/http.js'
import { requireAdmin } from '../../_lib/auth.js'
import { supabase } from '../../_lib/supabase.js'
import { DESIGNATION_QUOTA, padSerial, isValidLevel } from '../../_lib/designations.js'

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

  const { id, action } = req.query
  if (!id) return fail(res, 400, 'id is required')

  if (action === 'status') {
    if (req.method === 'PATCH') {
      const body = await readBody(req)
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

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

      if (error) return fail(res, 500, error.message)
      return ok(res, { deleted: true })
    }

    return fail(res, 405, 'Method not allowed')
  }

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

  if (req.method === 'DELETE') {
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
