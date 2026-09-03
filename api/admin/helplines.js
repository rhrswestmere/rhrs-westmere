import { ok, fail, readBody } from '../_lib/http.js'
import { requireAdmin } from '../_lib/auth.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
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

  return fail(res, 405, 'Method not allowed')
}
