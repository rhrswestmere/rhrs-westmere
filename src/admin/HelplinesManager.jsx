import { useCallback, useEffect, useState } from 'react'
import { getHelplines, addHelpline, updateHelpline, deleteHelpline } from './api'

const ICON_OPTIONS = ['✦', '◈', '◇', '▣', '☎', '📞', '🆘', '⚡']

function HelplineEditor({ helpline, onSave, onDelete, onMove, index, isFirst, isLast, busy }) {
  const [label, setLabel] = useState(helpline.label)
  const [number, setNumber] = useState(helpline.number)
  const [description, setDescription] = useState(helpline.description || '')
  const [icon, setIcon] = useState(helpline.icon || '✦')
  const [visible, setVisible] = useState(helpline.is_visible)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    setSaving(true)
    setErr('')
    try {
      await onSave(helpline, { label, number, description, icon, is_visible: visible })
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm(`"${helpline.label}" ko delete karein?`)) return
    setErr('')
    try {
      await onDelete(helpline)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="bg-white border border-border rounded-sm p-5 hover:border-saffron/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
            #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove(index, -1)} disabled={isFirst} className="w-7 h-7 bg-ink/10 text-ink rounded-sm text-sm hover:bg-saffron hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" title="Move up">↑</button>
          <button onClick={() => onMove(index, 1)} disabled={isLast} className="w-7 h-7 bg-ink/10 text-ink rounded-sm text-sm hover:bg-saffron hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" title="Move down">↓</button>
          <label className="flex items-center gap-1.5 text-xs text-ink-muted cursor-pointer ml-2">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-[#DE651A]" />
            Show
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Label</label>
            <input type="text" className="input-field !py-2" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. National Helpline" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Number</label>
            <input type="text" className="input-field !py-2" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 1800-123-4567" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Description</label>
          <input type="text" className="input-field !py-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Icon</label>
          <div className="flex gap-1.5">
            {ICON_OPTIONS.map((ic) => (
              <button key={ic} onClick={() => setIcon(ic)} className={`w-8 h-8 flex items-center justify-center text-sm rounded-sm border transition-all cursor-pointer ${icon === ic ? 'border-saffron bg-saffron-bg text-saffron' : 'border-border text-ink-muted hover:border-saffron/50'}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {err && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2 mt-3">⚠ {err}</p>}

      <div className="flex gap-2 mt-4">
        <button onClick={save} disabled={saving || busy} className="flex-1 btn-saffron !py-2 !text-xs" style={{ background: 'linear-gradient(135deg,#DE651A,#C0550A)' }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={remove} className="px-4 !py-2 border border-red-300 text-red-600 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer">
          Delete
        </button>
      </div>
    </div>
  )
}

export default function HelplinesManager({ token }) {
  const [helplines, setHelplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newIcon, setNewIcon] = useState('✦')
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setHelplines(await getHelplines(token))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  const addNew = async () => {
    if (!newLabel.trim() || !newNumber.trim()) {
      setError('Label aur number dono zaroori hain.')
      return
    }
    setAdding(true)
    setError('')
    try {
      const created = await addHelpline(token, {
        label: newLabel.trim(),
        number: newNumber.trim(),
        description: newDesc.trim(),
        icon: newIcon,
        sort_order: helplines.length,
      })
      setHelplines((prev) => [...prev, created])
      setNewLabel('')
      setNewNumber('')
      setNewDesc('')
      setNewIcon('✦')
      setShowForm(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  const saveHelpline = async (hl, patch) => {
    await updateHelpline(token, hl.id, patch)
    setHelplines((prev) => prev.map((h) => (h.id === hl.id ? { ...h, ...patch } : h)))
  }

  const removeHelpline = async (hl) => {
    await deleteHelpline(token, hl.id)
    setHelplines((prev) => prev.filter((h) => h.id !== hl.id))
  }

  const move = async (index, dir) => {
    const next = index + dir
    if (next < 0 || next >= helplines.length) return
    const a = helplines[index]
    const b = helplines[next]
    const arr = [...helplines]
    arr[index] = b
    arr[next] = a
    setHelplines(arr)
    const aOrder = a.sort_order ?? next
    const bOrder = b.sort_order ?? index
    try {
      await Promise.all([
        updateHelpline(token, a.id, { sort_order: bOrder }),
        updateHelpline(token, b.id, { sort_order: aOrder }),
      ])
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-ink-muted uppercase tracking-wider">Manage emergency helpline numbers shown on website</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-saffron !py-2 !px-4 !text-xs" style={{ background: 'linear-gradient(135deg,#DE651A,#C0550A)' }}>
          {showForm ? 'Cancel' : '+ Add Helpline'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border rounded-sm p-5 mb-6">
          <p className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Naya Helpline Add Karein</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Label *</label>
              <input type="text" className="input-field !py-2" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. National Helpline" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Number *</label>
              <input type="text" className="input-field !py-2" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="e.g. 1800-123-4567" />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Description</label>
            <input type="text" className="input-field !py-2" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description" />
          </div>
          <div className="mb-4">
            <label className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block mb-1">Icon</label>
            <div className="flex gap-1.5">
              {ICON_OPTIONS.map((ic) => (
                <button key={ic} onClick={() => setNewIcon(ic)} className={`w-8 h-8 flex items-center justify-center text-sm rounded-sm border transition-all cursor-pointer ${newIcon === ic ? 'border-saffron bg-saffron-bg text-saffron' : 'border-border text-ink-muted hover:border-saffron/50'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <button onClick={addNew} disabled={adding} className="btn-saffron !py-2 !text-xs" style={{ background: 'linear-gradient(135deg,#DE651A,#C0550A)' }}>
            {adding ? 'Adding…' : 'Add Helpline'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2 mb-6">⚠ {error}</p>}

      {loading && <p className="text-center text-sm text-ink-muted py-10">Loading…</p>}

      {!loading && helplines.length === 0 && (
        <div className="text-center py-16 bg-white border border-border rounded-sm">
          <p className="font-heading text-base font-bold text-ink mb-1">Abhi koi helpline nahi hai</p>
          <p className="text-xs text-ink-muted">Upar "Add Helpline" button se naya add karein.</p>
        </div>
      )}

      {!loading && helplines.length > 0 && (
        <div className="space-y-4">
          {helplines.map((hl, i) => (
            <HelplineEditor
              key={hl.id}
              helpline={hl}
              index={i}
              isFirst={i === 0}
              isLast={i === helplines.length - 1}
              onSave={saveHelpline}
              onDelete={removeHelpline}
              onMove={move}
              busy={adding}
            />
          ))}
        </div>
      )}
    </div>
  )
}
