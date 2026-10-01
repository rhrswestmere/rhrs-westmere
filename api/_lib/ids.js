import { supabase } from './supabase.js'

const pad = (n) => String(n).padStart(4, '0')

async function nextId(name, prefix) {
  const { data, error } = await supabase.rpc('next_sequence', { p_name: name })
  if (error) throw error
  return `${prefix}-${new Date().getFullYear()}-${pad(data)}`
}

export function nextMemberId() {
  return nextId('members', 'RHRS')
}

// Appointments and member IDs share ONE numbering series (the 'members'
// counter), so a member and their appointment letter always carry the same
// suffix (RHRS-2026-0035 <-> RHRS-APT-2026-0035).
export function nextAppointmentNo() {
  return nextId('members', 'RHRS-APT')
}

export function nextReceiptNo() {
  return nextId('payments', 'RHRS-RCT')
}
