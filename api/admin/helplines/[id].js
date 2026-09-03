import { ok, fail, readBody } from '../../_lib/http.js'
import { requireAdmin } from '../../_lib/auth.js'
import { supabase } from '../../_lib/supabase.js'

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  const { id } = req.query
  if (!id) return fail(res, 400, 'id is required')

  if (req.method === 'PATCH') {
    const body = await readBody(req)
    const updates = {}
    if (body.label !== undefined) updates.label = body.label
    if (body.number !== undefined) updates.number = body.number
    if (body.description !== undefined) updates.description = body.description
    if (body.icon !== undefined) updates.icon = body.icon
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order
    if (body.is_visible !== undefined) updates.is_visible = body.is_visible

    if (Object.keys(updates).length === 0) return fail(res, 400, 'No fields to update')

    const { data, error } = await supabase
      .from('helplines')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('helplines')
      .delete()
      .eq('id', id)

    if (error) return fail(res, 500, error.message)
    return ok(res, { success: true })
  }

  return fail(res, 405, 'Method not allowed')
}
