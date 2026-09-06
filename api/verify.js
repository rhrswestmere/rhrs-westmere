import { ok, fail } from './_lib/http.js'
import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return fail(res, 405, 'Method not allowed')

  const url = new URL(req.url, 'http://localhost')
  const memberId = url.searchParams.get('memberId')

  if (!memberId) return fail(res, 400, 'memberId query parameter is required')

  const { data, error } = await supabase
    .from('members')
    .select('member_id, full_name, blood_group, emergency_contact, designation_title, designation_number, is_active, created_at')
    .eq('member_id', memberId)
    .single()

  if (error || !data) return fail(res, 404, 'Member not found')

  const createdAt = data.created_at ? new Date(data.created_at) : null
  let validUpto = null
  if (createdAt) {
    validUpto = new Date(createdAt)
    validUpto.setFullYear(validUpto.getFullYear() + 1)
  }

  return ok(res, {
    memberId: data.member_id,
    name: data.full_name,
    bloodGroup: data.blood_group,
    mobile: data.emergency_contact,
    designation: data.designation_title || 'ACTIVE MEMBER',
    designationNumber: data.designation_number,
    isActive: data.is_active,
    createdAt: data.created_at,
    validUpto: validUpto ? validUpto.toISOString() : null,
  })
}
