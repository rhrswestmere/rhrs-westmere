import { Fragment, useEffect, useState } from 'react'
import { searchMembers, toggleMemberStatus, deleteMember } from './api'
import { postJSON } from '../lib/api'
import { DESIGNATION_LEVELS, DESIGNATION_LABELS } from './designations'
import { pdfUrl } from '../pdfs/utils'

function MemberRow({ member, onSelect, selected, onToggleStatus, onDelete, saving }) {
  const hasDesig = !!member.designation_level
  const isActive = member.is_active !== false
  return (
    <tr className={`border-b border-border/60 transition-colors ${selected ? 'bg-saffron-bg' : 'hover:bg-saffron-bg/40'} ${!isActive ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3 text-xs font-mono text-ink">{member.member_id}</td>
      <td className="px-4 py-3 text-xs font-bold text-ink">{member.full_name}</td>
      <td className="px-4 py-3 text-xs text-ink-muted">{member.emergency_contact || '---'}</td>
      <td className="px-4 py-3">
        {hasDesig ? (
          <span className="text-[10px] font-bold text-saffron bg-saffron-bg border border-saffron/30 rounded-sm px-2 py-1">
            {member.designation_title} · {member.designation_number}
          </span>
        ) : (
          <span className="text-[10px] text-ink-muted">---</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelect(member)}
            className="text-[10px] font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-3 py-1.5 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer"
          >
            ID Card
          </button>
          <button
            onClick={() => onToggleStatus(member)}
            disabled={saving}
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-all cursor-pointer border ${isActive ? 'border-orange-300 text-orange-600 hover:bg-orange-600 hover:text-white' : 'border-green-300 text-green-600 hover:bg-green-600 hover:text-white'}`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => onDelete(member)}
            disabled={saving}
            className="text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-300 px-3 py-1.5 rounded-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function MembersView({ token }) {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [pdf, setPdf] = useState(null)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [statusBusy, setStatusBusy] = useState(false)

  const load = async (q = query, p = page, from = fromDate, to = toDate) => {
    setLoading(true)
    setError('')
    try {
      const res = await searchMembers(token, q, p, 20, from || null, to || null)
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load('', 1, '', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load(query, 1)
  }

  const handleDateFilter = () => {
    setPage(1)
    load(query, 1, fromDate, toDate)
  }

  const handleClearDates = () => {
    setFromDate('')
    setToDate('')
    setPage(1)
    load(query, 1, '', '')
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    load(query, newPage)
  }

  const handleSelect = (member) => {
    setSelected(member)
    if (pdf) URL.revokeObjectURL(pdf)
    setPdf(null)
  }

  const handlePdf = async () => {
    if (!selected) return
    if (pdf) URL.revokeObjectURL(pdf)
    setPdf(null)
    setPdfBusy(true)
    try {
      const mod = await import('../pdfs/IdCardPDF')
      const url = await pdfUrl(<mod.default data={selected} />)
      setPdf(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setPdfBusy(false)
    }
  }

  const handleAppointmentLetter = async () => {
    if (!selected) return
    setPdfBusy(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const apptData = await postJSON('/api/appointments', {
        full_name: selected.full_name,
        designation: 'Membership Confirmation',
        from_date: today,
        duration: '10:00',
      })
      const mod = await import('../pdfs/AppointmentPDF')
      const url = await pdfUrl(<mod.default data={apptData} />)
      const link = document.createElement('a')
      link.href = url
      link.download = `RHRS-APPT-${apptData.appointment_no}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Appointment letter failed:', err)
      setError('Appointment letter banane me error: ' + err.message)
    } finally {
      setPdfBusy(false)
    }
  }

  const handleToggleStatus = async (member) => {
    const isActive = member.is_active !== false
    const action = isActive ? 'deactivate' : 'activate'
    if (!window.confirm(`Member ${action} karein? ${isActive ? 'Ye active list se hat jayega.' : 'Ye wapas active list me aa jayega.'}`)) return
    setStatusBusy(true)
    try {
      await toggleMemberStatus(token, member.id, !isActive)
      await load()
      if (selected?.id === member.id) {
        setSelected({ ...member, is_active: !isActive })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setStatusBusy(false)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Member "${member.full_name}" (${member.member_id}) permanently delete karein? Ye action undo nahi hoga.`)) return
    setStatusBusy(true)
    try {
      await deleteMember(token, member.id)
      if (selected?.id === member.id) setSelected(null)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setStatusBusy(false)
    }
  }

  const quota = data?.quota
  const pagination = data?.pagination
  const members = data?.members || []

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-sm p-5">
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">Search Members</label>
            <input
              className="input-field"
              placeholder="Name / Mobile / Member ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-saffron">
            {loading ? 'Searching…' : '🔍 Search'}
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-3 mb-3">
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">From Date</label>
            <input type="date" className="input-field" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">To Date</label>
            <input type="date" className="input-field" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button onClick={handleDateFilter} disabled={loading} className="btn-saffron">
            Filter
          </button>
          {(fromDate || toDate) && (
            <button onClick={handleClearDates} className="border border-border text-ink-muted text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:bg-saffron-bg transition-all cursor-pointer">
              Clear Dates
            </button>
          )}
        </div>

        {pagination && (
          <p className="text-[11px] text-ink-muted">
            Showing {members.length} of {pagination.total} members
            {fromDate || toDate ? ` (filtered)` : ''}
            {pagination.totalPages > 1 ? ` · Page ${pagination.page} of ${pagination.totalPages}` : ''}
          </p>
        )}
      </div>

      {quota && (
        <div className="bg-white border border-border rounded-sm p-5">
          <h3 className="font-heading text-sm font-bold text-ink mb-3">Designation Quota ({quota.perLevel} seats per category)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {DESIGNATION_LEVELS.map((level) => {
              const used = quota.used?.[level] || 0
              const full = used >= quota.perLevel
              return (
                <div key={level} className={`border rounded-sm px-3 py-2.5 ${full ? 'border-red-300 bg-red-50' : 'border-saffron/30 bg-saffron-bg'}`}>
                  <p className="text-[11px] font-bold text-ink">{DESIGNATION_LABELS[level]}</p>
                  <p className={`text-xs font-bold mt-1 ${full ? 'text-red-600' : 'text-saffron'}`}>
                    {used}/{quota.perLevel} {full ? '· FULL' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}

      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-4 bg-saffron-bg border-b border-saffron/20 flex justify-between items-center">
          <h3 className="font-heading text-sm font-bold text-ink">Members ({pagination?.total || members.length})</h3>
        </div>
        {members.length === 0 ? (
          <p className="text-xs text-ink-muted px-5 py-6 text-center">Koi member nahi mila.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-ink-muted border-b border-border">
                  <th className="px-4 py-3 font-bold">Member ID</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Mobile</th>
                  <th className="px-4 py-3 font-bold">Designation</th>
                  <th className="px-4 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <Fragment key={m.id}>
                    <MemberRow member={m} selected={selected?.id === m.id} onSelect={handleSelect} onToggleStatus={handleToggleStatus} onDelete={handleDelete} saving={statusBusy} />
                    {selected?.id === m.id && (
                      <tr className="bg-saffron-bg/40 border-b border-saffron/20">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <p className="text-[11px] font-bold text-ink uppercase tracking-wider">
                              ID Card
                            </p>
                            <span className="text-xs font-mono text-saffron">
                              {selected.full_name} · {selected.member_id}
                            </span>
                          </div>
                          {selected.designation_level && (
                            <p className="text-[11px] text-ink-muted mb-3">
                              Designation: <span className="font-bold text-ink">{selected.designation_title}</span> · <span className="font-mono">{selected.designation_number}</span>
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3">
                            <button onClick={handlePdf} disabled={pdfBusy} className="btn-saffron">
                              {pdfBusy ? 'Preparing…' : '⬇ ID Card PDF'}
                            </button>
                            <button onClick={handleAppointmentLetter} disabled={pdfBusy} className="border border-saffron/40 text-saffron text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer">
                              {pdfBusy ? 'Preparing…' : '▣ Appointment Letter'}
                            </button>
                          </div>
                          {pdf && (
                            <div className="flex flex-wrap gap-3 items-center mt-3">
                              <a href={pdf} download={`RHRS-ID-${selected.member_id}.pdf`} className="btn-saffron">⬇ Download PDF</a>
                              <a href={pdf} target="_blank" rel="noreferrer" className="border border-saffron/40 text-saffron text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer">
                                Preview / Print
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="text-xs font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-4 py-2 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-xs text-ink-muted">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="text-xs font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-4 py-2 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
