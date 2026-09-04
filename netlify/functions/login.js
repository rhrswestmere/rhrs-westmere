import { adaptHandler } from './_adapter.js'
import { ok, fail, readBody } from '../../api/_lib/http.js'
import { signAdminToken } from '../../api/_lib/auth.js'
import { supabase } from '../../api/_lib/supabase.js'

async function dbAdmin() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('username, password')
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return data
}

function envMatch(username, password) {
  return (
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
}

async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const { username, password } = req.body || {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    return fail(res, 401, 'Invalid credentials')
  }

  const db = await dbAdmin()
  const valid =
    envMatch(username, password) ||
    (!!db && username === db.username && password === db.password)

  if (!valid) return fail(res, 401, 'Invalid credentials')

  const token = await signAdminToken()
  return ok(res, { token })
}

export const handler = adaptHandler(handler)
