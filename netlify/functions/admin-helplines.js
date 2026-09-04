import { adaptHandler } from '../_adapter.js'
import { ok, fail, readBody } from '../../../api/_lib/http.js'
import { requireAdmin } from '../../../api/_lib/auth.js'
import { supabase } from '../../../api/_lib/supabase.js'

async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('helplines')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false })

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const { label, number, description, icon, sort_order, is_visible } = body
    if (!label || !number) return fail(res, 400, 'label and number are required')

    const { data, error } = await supabase
      .from('helplines')
      .insert({
        label,
        number,
        description: description || '',
        icon: icon || '✦',
        sort_order: typeof sort_order === 'number' ? sort_order : null,
        is_visible: is_visible === false ? false : true,
      })
      .select('*')
      .single()

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    const id = req.query?.id
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
  }

  return fail(res, 405, 'Method not allowed')
}

export const handler = adaptHandler(handler)
