import { Fragment, useEffect, useState, useRef } from 'react'
import { searchMembers, toggleMemberStatus, deleteMember, editMember } from './api'
import { getUploadUrl, uploadToSignedUrl } from './api'
import { postJSON } from '../lib/api'
import { DESIGNATION_LEVELS, DESIGNATION_LABELS } from './designations'
import { pdfUrl } from '../pdfs/utils'

function MemberRow({ member, onSelect, selected, onEdit, onToggleStatus, onDelete, saving }) {
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
            onClick={() => onEdit(member)}
            className="text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-300 px-3 py-1.5 rounded-sm hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            Edit
          </button>
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

function EditForm({ member, token, onSave, onCancel }) {
  const [form, setForm] = useState({
    full_name: member.full_name || '',
    address: member.address || '',
    blood_group: member.blood_group || 'A+',
    emergency_contact: member.emergency_contact || '',
    member_id: member.member_id || '',
    designation_level: member.designation_level || '',
    designation_title: member.designation_title || '',
    designation_state: member.designation_state || '',
  })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(member.photo_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo 5MB se badi nahi honi chahiye')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(file)
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Name required hai'); return }
    if (!form.address.trim()) { setError('Address required hai'); return }
    if (!form.emergency_contact.trim()) { setError('Mobile required hai'); return }

    setSaving(true)
    setError('')
    try {
      let photoUrl = member.photo_url || null
      if (photo) {
        const uploadData = await getUploadUrl(token, photo.name)
        await uploadToSignedUrl(uploadData.signedUrl, photo)
        photoUrl = uploadData.publicUrl
      }

      const payload = {
        full_name: form.full_name,
        address: form.address,
        blood_group: form.blood_group,
        emergency_contact: form.emergency_contact,
        member_id: form.member_id,
        photo_url: photoUrl,
      }
      if (form.designation_level) {
        payload.designation_level = form.designation_level
        payload.designation_title = form.designation_title
        payload.designation_state = form.designation_state
      }

      const updated = await editMember(token, member.id, payload)
      onSave(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="bg-blue-50/50 border-b border-blue-200">
      <td colSpan={5} className="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-[11px] font-bold text-ink uppercase tracking-wider">Edit Member</p>
          <span className="text-xs font-mono text-saffron">{member.member_id}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Full Name *</label>
              <input type="text" required className="input-field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Member ID</label>
              <input type="text" className="input-field font-mono" value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Mobile *</label>
              <input type="tel" required className="input-field" value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Blood Group</label>
              <select className="input-field" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })}>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Address *</label>
              <input type="text" required className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Designation Level</label>
              <select className="input-field" value={form.designation_level} onChange={(e) => setForm({ ...form, designation_level: e.target.value, designation_title: '' })}>
                <option value="">None</option>
                {DESIGNATION_LEVELS.map((l) => <option key={l} value={l}>{DESIGNATION_LABELS[l]}</option>)}
              </select>
            </div>
            {form.designation_level && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Designation Title</label>
                  <input type="text" className="input-field" value={form.designation_title} onChange={(e) => setForm({ ...form, designation_title: e.target.value })} placeholder="e.g. State President" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">State / Region</label>
                  <input type="text" className="input-field" value={form.designation_state} onChange={(e) => setForm({ ...form, designation_state: e.target.value })} placeholder="Optional" />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Photo</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-[64px] rounded-sm border-2 border-dashed border-blue-300 bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] text-ink-muted/60 text-center leading-tight px-1">PHOTO</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="inline-block text-[10px] font-bold uppercase tracking-wider border border-blue-300 text-blue-600 px-3 py-1.5 rounded-sm hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    {photo ? 'Change' : 'Upload'}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                  {photo && (
                    <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(member.photo_url || '') }} className="block text-[9px] text-red-600 underline cursor-pointer">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-saffron">
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
            <button type="button" onClick={onCancel} disabled={saving} className="border border-border text-ink-muted text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-saffron-bg transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
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
  const [editing, setEditing] = useState(null)
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
    setEditing(null)
    if (pdf) URL.revokeObjectURL(pdf)
    setPdf(null)
  }

  const handleEdit = (member) => {
    setEditing(member)
    setSelected(null)
    if (pdf) URL.revokeObjectURL(pdf)
    setPdf(null)
  }

  const handleEditSave = (updated) => {
    setEditing(null)
    load()
    if (selected?.id === updated.id) setSelected(updated)
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

  const handleDesignationLetter = async () => {
    if (!selected) return
    setPdfBusy(true)
    try {
      const mod = await import('../pdfs/DesignationAppointmentPDF')
      const url = await pdfUrl(<mod.default data={selected} />)
      const link = document.createElement('a')
      link.href = url
      link.download = `RHRS-DESIG-${selected.member_id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Designation letter failed:', err)
      setError('Designation letter banane me error: ' + err.message)
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
      if (editing?.id === member.id) setEditing(null)
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
                    {editing?.id === m.id ? (
                      <EditForm member={m} token={token} onSave={handleEditSave} onCancel={() => setEditing(null)} />
                    ) : (
                      <MemberRow member={m} selected={selected?.id === m.id} onSelect={handleSelect} onEdit={handleEdit} onToggleStatus={handleToggleStatus} onDelete={handleDelete} saving={statusBusy} />
                    )}
                    {selected?.id === m.id && editing?.id !== m.id && (
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
                            {selected.designation_title && (
                              <button onClick={handleDesignationLetter} disabled={pdfBusy} className="border border-green-600 text-green-700 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                                {pdfBusy ? 'Preparing…' : '★ Designation Letter'}
                              </button>
                            )}
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
