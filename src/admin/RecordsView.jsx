import { useEffect, useState } from 'react'
import { getRecords } from './api'
import { fmtAppointmentTime } from '../pdfs/appointmentJson'

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

function Section({ title, rows, headers, render }) {
  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden">
      <div className="px-5 py-4 bg-saffron-bg border-b border-saffron/20 flex justify-between items-center">
        <h3 className="font-heading text-sm font-bold text-ink">{title}</h3>
        <span className="text-xs font-bold text-saffron px-2 py-0.5 bg-white border border-saffron/30 rounded-sm">{rows.length}</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-ink-muted px-5 py-6 text-center">Abhi koi record nahi hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-ink-muted border-b border-border">
                {headers.map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-saffron-bg/40 transition-colors">
                  {render(row).map((cell, i) => <td key={i} className="px-4 py-3 text-xs text-ink">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function RecordsView({ token }) {
  const [records, setRecords] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getRecords(token)
      .then((data) => { if (!cancelled) setRecords(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  if (loading) return <p className="text-center text-sm text-ink-muted py-10">Loading…</p>
  if (error) return <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>

  const { members = [], appointments = [], payments = [] } = records || {}

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Members', value: members.length, icon: '◈' },
          { label: 'Appointments', value: appointments.length, icon: '▣' },
          { label: 'Payments', value: payments.length, icon: '✦' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-sm p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-sm bg-saffron-bg text-saffron text-lg flex items-center justify-center shrink-0">{s.icon}</span>
            <div>
              <p className="font-heading text-2xl font-bold text-ink leading-none">{s.value}</p>
              <p className="text-[10px] text-ink-muted uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Section
        title="Recent Members (ID Cards)"
        rows={members}
        headers={['Member ID', 'Name', 'Blood Group', 'Contact', 'Date']}
        render={(r) => [r.member_id, r.full_name, r.blood_group, r.emergency_contact, fmtDate(r.created_at)]}
      />
      <Section
        title="Recent Appointments"
        rows={appointments}
        headers={['Appt. No.', 'Name', 'Purpose', 'Time', 'Booked On']}
        render={(r) => [r.appointment_no, r.full_name, r.designation, fmtAppointmentTime(r.duration), fmtDate(r.created_at)]}
      />
      <Section
        title="Recent Payments (Slips)"
        rows={payments}
        headers={['Receipt No.', 'Donor', 'Type', 'Amount (₹)', 'Mode']}
        render={(r) => [r.receipt_no, r.donor_name, r.donation_type, Number(r.amount).toLocaleString('en-IN'), r.payment_mode]}
      />
    </div>
  )
}
