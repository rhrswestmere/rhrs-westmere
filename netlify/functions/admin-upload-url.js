import { adaptHandler } from '../_adapter.js'
import { ok, fail, readBody } from '../../../api/_lib/http.js'
import { requireAdmin } from '../../../api/_lib/auth.js'
import { createClient } from '@supabase/supabase-js'

async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { filename } = body
  if (!filename) return fail(res, 400, 'filename is required')

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const timestamp = Date.now()
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const path = `${timestamp}-${safeName}`

  const { data, error } = await supabase.storage
    .from('gallery')
    .createSignedUploadUrl(path)

  if (error) return fail(res, 500, error.message)
  return ok(res, { signedUrl: data.signedUrl, path })
}

export const handler = adaptHandler(handler)
