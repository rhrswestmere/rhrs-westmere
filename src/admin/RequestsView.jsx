import { useEffect, useState } from 'react'
import { getRequests, approveRequest, rejectRequest, searchMembers } from './api'
import { DESIGNATION_LABELS } from './designations'

export default function RequestsView({ token }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionBusy, setActionBusy] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [memberResults, setMemberResults] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getRequests(token)
      setRequests(res.rows || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [token])

  const handleSearchMembers = async (q) => {
    setMemberSearch(q)
    if (q.length < 2) { setMemberResults([]); return }
    try {
      const res = await searchMembers(token, q, 1, 10)
      setMemberResults(res.members || [])
    } catch { setMemberResults([]) }
  }

  const handleApprove = async (req) => {
    if (!selectedRequest || selectedRequest.id !== req.id) {
      setError('Pehle member select karo is request ke liye')
      return
    }
    if (!window.confirm(`Assign "${req.requested_title}" designation to ${selectedRequest.member_name || selectedRequest.donor_name}?`)) return
    setActionBusy(req.id)
    setError('')
    try {
      await approveRequest(token, selectedRequest.memberId, req.id)
      setRequests((prev) => prev.filter((r) => r.id !== req.id))
      setSelectedRequest(null)
      setMemberSearch('')
      setMemberResults([])
    } catch (err) {
      setError('Approve failed: ' + err.message)
    } finally {
      setActionBusy('')
    }
  }

  const handleReject = async (req) => {
    if (!window.confirm(`Reject ${req.donor_name}'s designation request?`)) return
    setActionBusy(req.id)
    setError('')
    try {
      await rejectRequest(token, req.id)
      setRequests((prev) => prev.filter((r) => r.id !== req.id))
    } catch (err) {
      setError('Reject failed: ' + err.message)
    } finally {
      setActionBusy('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-bold text-ink">Pending Designation Requests</h3>
          <button onClick={load} disabled={loading} className="text-xs font-bold uppercase tracking-wider text-saffron border border-saffron/40 px-4 py-2 rounded-sm hover:bg-saffron hover:text-white transition-all cursor-pointer">
            {loading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2 mb-3">⚠ {error}</p>}

        {requests.length === 0 ? (
          <p className="text-xs text-ink-muted text-center py-8">Koi pending request nahi hai.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="border border-saffron/30 rounded-sm p-4 bg-saffron-bg/30">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-bold text-ink">{req.donor_name}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">Receipt: {req.receipt_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-saffron">₹{Number(req.amount).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-ink-muted">{req.payment_mode} · {req.txn_ref}</p>
                  </div>
                </div>

                <div className="bg-white border border-saffron/20 rounded-sm p-3 mb-3">
                  <p className="text-[10px] text-ink-muted uppercase tracking-wider mb-1">Requested Designation</p>
                  <p className="text-sm font-bold text-ink">
                    {DESIGNATION_LABELS[req.requested_level] || req.requested_level} → {req.requested_title}
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">Assign to Member *</label>
                    <input
                      type="text"
                      placeholder="Search member by name or ID…"
                      className="input-field"
                      value={selectedRequest?.id === req.id ? memberSearch : ''}
                      onChange={(e) => {
                        setSelectedRequest(req)
                        handleSearchMembers(e.target.value)
                      }}
                    />
                    {selectedRequest?.id === req.id && memberResults.length > 0 && (
                      <div className="bg-white border border-border rounded-sm mt-1 max-h-40 overflow-y-auto">
                        {memberResults.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedRequest({ ...req, memberId: m.id, member_name: m.full_name })
                              setMemberSearch(m.full_name + ' (' + m.member_id + ')')
                              setMemberResults([])
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-saffron-bg transition-colors cursor-pointer border-b border-border/50 last:border-0"
                          >
                            <span className="font-bold">{m.full_name}</span>
                            <span className="text-ink-muted ml-2">{m.member_id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={actionBusy === req.id || !selectedRequest || selectedRequest.id !== req.id}
                    className="text-[10px] font-bold uppercase tracking-wider text-white bg-green-600 border border-green-600 px-4 py-2.5 rounded-sm hover:bg-green-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {actionBusy === req.id ? 'Processing…' : '✓ Approve & Assign'}
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    disabled={actionBusy === req.id}
                    className="text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-300 px-4 py-2.5 rounded-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer disabled:opacity-40"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
