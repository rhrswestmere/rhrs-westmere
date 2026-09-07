import { useState } from 'react'
import { getReport } from './api'
import { pdfUrl } from '../pdfs/utils'

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const PRESETS = [
  { label: 'Current Month', value: 'current_month' },
  { label: 'Last 2 Months', value: 'last_2_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Current Year', value: 'current_year' },
  { label: 'Financial Year', value: 'financial_year' },
]

function getPresetDates(preset) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  switch (preset) {
    case 'current_month':
      return { from: new Date(y, m, 1).toISOString(), to: now.toISOString() }
    case 'last_2_months':
      return { from: new Date(y, m - 2, 1).toISOString(), to: now.toISOString() }
    case 'last_6_months':
      return { from: new Date(y, m - 6, 1).toISOString(), to: now.toISOString() }
    case 'current_year':
      return { from: new Date(y, 0, 1).toISOString(), to: now.toISOString() }
    case 'financial_year': {
      const fyStart = m >= 3 ? new Date(y, 3, 1) : new Date(y - 1, 3, 1)
      return { from: fyStart.toISOString(), to: now.toISOString() }
    }
    default:
      return { from: null, to: null }
  }
}

function ReportTable({ columns, rows, render }) {
  if (rows.length === 0) return <p className="text-xs text-ink-muted px-5 py-6 text-center">No records found for the selected period.</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" id="report-table">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-ink-muted border-b border-border">
            {columns.map((c) => <th key={c} className="px-4 py-3 font-bold">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-saffron-bg/40 transition-colors">
              {render(row).map((cell, j) => <td key={j} className="px-4 py-3 text-xs text-ink">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ReportsView({ token }) {
  const [reportType, setReportType] = useState('members')
  const [preset, setPreset] = useState('financial_year')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfBusy, setPdfBusy] = useState(false)

  const handlePreset = (val) => {
    setPreset(val)
    const dates = getPresetDates(val)
    setFromDate(dates.from ? new Date(dates.from).toISOString().split('T')[0] : '')
    setToDate(dates.to ? new Date(dates.to).toISOString().split('T')[0] : '')
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const from = fromDate ? new Date(fromDate).toISOString() : null
      const to = toDate ? new Date(toDate).toISOString() : null
      const res = await getReport(token, reportType, from, to)
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    const content = document.getElementById('report-table')
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>RHRS ${reportType === 'members' ? 'Member' : 'Donation'} Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; margin-bottom: 5px; }
        .meta { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
        th { background: #f5f0e8; font-weight: bold; }
        .summary { margin-bottom: 15px; font-size: 13px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <h2>Rashtriya Hindu Rakshak Sangh</h2>
      <p class="meta">${reportType === 'members' ? 'Member' : 'Donation'} Report · ${fmtDate(data?.from)} — ${fmtDate(data?.to)}</p>
      <div class="summary">
        <p>Total Records: <strong>${data?.total || 0}</strong></p>
        ${reportType === 'donations' && data?.summary ? `<p>Total Amount: <strong>₹${Number(data.summary.totalAmount).toLocaleString('en-IN')}</strong></p>` : ''}
      </div>
      ${content.outerHTML}
      <script>setTimeout(() => window.print(), 500);</script>
      </body></html>
    `)
    win.document.close()
  }

  const handlePdf = async () => {
    if (!data?.rows?.length) return
    setPdfBusy(true)
    try {
      let mod
      if (reportType === 'members') {
        mod = await import('../pdfs/MemberReportPDF')
      } else {
        mod = await import('../pdfs/DonationReportPDF')
      }
      const url = await pdfUrl(<mod.default data={data} />)
      const link = document.createElement('a')
      link.href = url
      link.download = `RHRS-${reportType === 'members' ? 'Members' : 'Donations'}-Report.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setPdfBusy(false)
    }
  }

  const rows = data?.rows || []

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-sm p-5">
        <h3 className="font-heading text-sm font-bold text-ink mb-4">Generate Report</h3>

        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={() => setReportType('members')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${reportType === 'members' ? 'bg-saffron text-white' : 'border border-border text-ink-muted hover:bg-saffron-bg'}`}>
            ◆ Member Report
          </button>
          <button onClick={() => setReportType('donations')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${reportType === 'donations' ? 'bg-saffron text-white' : 'border border-border text-ink-muted hover:bg-saffron-bg'}`}>
            ✦ Donation Report
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button key={p.value} onClick={() => handlePreset(p.value)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${preset === p.value ? 'bg-saffron text-white' : 'border border-saffron/30 text-saffron hover:bg-saffron hover:text-white'}`}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">From Date</label>
            <input type="date" className="input-field" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPreset('') }} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">To Date</label>
            <input type="date" className="input-field" value={toDate} onChange={(e) => { setToDate(e.target.value); setPreset('') }} />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-saffron">
            {loading ? 'Generating…' : '📊 Generate Report'}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}

      {data && (
        <div className="bg-white border border-border rounded-sm overflow-hidden">
          <div className="px-5 py-4 bg-saffron-bg border-b border-saffron/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-sm font-bold text-ink">
                  {reportType === 'members' ? 'Member' : 'Donation'} Report
                </h3>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {fmtDate(data.from)} — {fmtDate(data.to)} · {data.total} records
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePdf} disabled={pdfBusy} className="text-[10px] font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-3 py-1.5 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer">
                  {pdfBusy ? 'Preparing…' : '⬇ PDF'}
                </button>
                <button onClick={handlePrint} className="text-[10px] font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-3 py-1.5 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer">
                  🖨 Print
                </button>
              </div>
            </div>

            {reportType === 'donations' && data.summary && (
              <div className="flex gap-6 mt-3">
                <div className="bg-white border border-saffron/20 rounded-sm px-4 py-2">
                  <p className="text-[9px] text-ink-muted uppercase tracking-wider">Total Donations</p>
                  <p className="text-lg font-bold text-saffron">{data.summary.totalDonations}</p>
                </div>
                <div className="bg-white border border-saffron/20 rounded-sm px-4 py-2">
                  <p className="text-[9px] text-ink-muted uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-bold text-saffron">₹{Number(data.summary.totalAmount).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>

          {reportType === 'members' ? (
            <ReportTable
              columns={['Member ID', 'Name', 'Contact', 'Blood Group', 'Designation', 'Joined']}
              rows={rows}
              render={(r) => [
                r.member_id,
                r.full_name,
                r.emergency_contact || '---',
                r.blood_group,
                r.designation_title || 'Active Member',
                fmtDate(r.created_at),
              ]}
            />
          ) : (
            <ReportTable
              columns={['Receipt No.', 'Donor', 'Type', 'Amount (₹)', 'Mode', 'Date']}
              rows={rows}
              render={(r) => [
                r.receipt_no,
                r.donor_name,
                r.donation_type,
                `₹${Number(r.amount).toLocaleString('en-IN')}`,
                r.payment_mode,
                fmtDate(r.created_at),
              ]}
            />
          )}
        </div>
      )}
    </div>
  )
}
