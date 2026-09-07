import { ok, fail, readBody } from '../_lib/http.js'
import { requireAdmin } from '../_lib/auth.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const filename = (body.filename || 'image.png').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
  const folder = body.folder === 'members' ? 'members' : 'gallery'
  const path = `${folder}/${Date.now()}-${filename}`

  const { data, error } = await supabase.storage.from('gallery').createSignedUploadUrl(path)
  if (error) return fail(res, 500, error.message)

  const publicUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl

  return ok(res, { signedUrl: data.signedUrl, token: data.token, path, publicUrl })
}
