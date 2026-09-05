import { ok, fail } from '../../_lib/http.js'
import { requireAdmin } from '../../_lib/auth.js'
import { supabase } from '../../_lib/supabase.js'

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  const { id } = req.query
  if (!id) return fail(res, 400, 'id is required')

  if (req.method === 'PATCH') {
    const body = await new Promise((resolve, reject) => {
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
