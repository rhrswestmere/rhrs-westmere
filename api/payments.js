import { ok, fail, readBody } from './_lib/http.js'
import { supabase } from './_lib/supabase.js'
import { nextReceiptNo } from './_lib/ids.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

  const body = await readBody(req)
  const { donor_name, donation_type, amount, payment_mode, txn_ref, requested_level, requested_title } = body
  if (!donor_name || !donation_type || !amount || !payment_mode || !txn_ref) {
    return fail(res, 400, 'donor_name, donation_type, amount, payment_mode, txn_ref are required')
  }

  if (Number(amount) < 1) {
    return fail(res, 400, 'Amount must be at least ₹1')
  }

  const isDesignationRequest = requested_level && requested_title
  if (isDesignationRequest && Number(amount) < 200) {
    return fail(res, 400, 'Minimum ₹200 required for designation request')
  }

  let receipt_no
  try {
    receipt_no = await nextReceiptNo()
  } catch (err) {
    return fail(res, 500, err.message)
  }

  const insertData = {
    receipt_no,
    donor_name,
    donation_type,
    amount: Number(amount),
    payment_mode,
    txn_ref,
    status: isDesignationRequest ? 'pending' : 'approved',
  }

  if (isDesignationRequest) {
    insertData.requested_level = requested_level
    insertData.requested_title = requested_title
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(insertData)
    .select('*')
    .single()

  if (error) return fail(res, 500, error.message)
  return ok(res, data)
}
