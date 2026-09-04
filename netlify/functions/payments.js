import { adaptHandler } from './_adapter.js'
import { ok, fail, readBody } from '../../api/_lib/http.js'
import { supabase } from '../../api/_lib/supabase.js'
import { nextReceiptNo } from '../../api/_lib/ids.js'

async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { donor_name, donation_type, amount, payment_mode, txn_ref } = body
  if (!donor_name || !donation_type || !amount || !payment_mode || !txn_ref) {
    return fail(res, 400, 'All fields are required')
  }

  const receipt_no = await nextReceiptNo()

  const { data, error } = await supabase
    .from('payments')
    .insert({ receipt_no, donor_name, donation_type, amount, payment_mode, txn_ref })
    .select('*')
    .single()

  if (error) return fail(res, 500, error.message)
  return ok(res, data)
}

export const handler = adaptHandler(handler)
