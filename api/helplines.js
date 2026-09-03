import { ok, fail } from './_lib/http.js'
import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return fail(res, 405, 'Method not allowed')

  const { data, error } = await supabase
    .from('helplines')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })

  if (error) return fail(res, 500, error.message)
  return ok(res, data)
}
