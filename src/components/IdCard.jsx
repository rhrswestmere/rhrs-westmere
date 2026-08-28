import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { postJSON } from '../lib/api'
import { pdfUrl, fetchImageBase64 } from '../pdfs/utils'

function useSubmit(endpoint) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const submit = async (payload) => {
    setLoading(true)
    setError('')
    try {
      const data = await postJSON(endpoint, payload)
      setResult(data)
      return data
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const reset = () => {
    setResult(null)
    setError('')
  }

  return { loading, error, result, submit, reset }
}

function Label({ children }) {
  return <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1.5">{children}</label>
}

function downscaleToPassport(img, maxW = 480, maxH = 600) {
  const scale = Math.min(1, maxW / img.width, maxH / img.height)
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.85)
}

function ResultActions({ pdf, pdfBusy, error, filename, onReset }) {
  return (
    <div className="space-y-2">
      {pdf ? (
        <a href={pdf} download={filename} className="inline-flex w-full btn-saffron">⬇ Download PDF</a>
      ) : error ? (
        <div className="text-center text-xs text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-3">
          ⚠ PDF banane me error: {error}
        </div>
      ) : (
        <p className="text-center text-xs text-ink-muted py-3">{pdfBusy ? 'PDF तैयार हो रहा है…' : 'PDF prepare ho raha hai…'}</p>
      )}
      {pdf && (
        <a href={pdf} target="_blank" rel="noreferrer" className="block w-full border border-saffron/40 text-saffron text-xs font-bold uppercase tracking-wider py-2.5 text-center hover:bg-saffron hover:text-white transition-all duration-200 cursor-pointer">
          Preview / Print
        </a>
      )}
      <button onClick={onReset} className="w-full border border-saffron/40 text-saffron text-xs font-bold uppercase tracking-wider py-2.5 hover:bg-saffron hover:text-white transition-all duration-200 cursor-pointer">
        ⟲ Generate Another
      </button>
    </div>
  )
}

function SuccessCard({ title, result, pdf, pdfBusy, error, filename, onReset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-saffron/30 rounded-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-saffron via-gold to-saffron" />
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-green-600 text-white text-2xl flex items-center justify-center shadow-md mb-3">✓</div>
          <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
          <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Successfully generated · DB me save ho gaya</p>
        </div>
        <div className="bg-saffron-bg border border-saffron/20 rounded-sm p-4 mb-5">
          <p className="text-[10px] text-ink-muted uppercase tracking-wider text-center mb-1">Assigned Number</p>
          <p className="font-mono text-lg font-bold text-saffron-deep text-center tracking-wider">
            {result.member_id || result.appointment_no || result.receipt_no}
          </p>
        </div>
        <ResultActions pdf={pdf} pdfBusy={pdfBusy} error={error} filename={filename} onReset={onReset} />
      </div>
    </motion.div>
  )
}

function usePdf() {
  const [pdf, setPdf] = useState(null)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState('')

  const clear = () => {
    if (pdf) URL.revokeObjectURL(pdf)
    setPdf(null)
    setPdfError('')
  }

  const generate = async (loader, data, imageUrl) => {
    clear()
    setPdfBusy(true)
    try {
      let bgImage = null
      if (imageUrl) {
        bgImage = await fetchImageBase64(imageUrl)
      }
      const mod = await loader()
      const Component = mod.default
      const url = await pdfUrl(<Component data={data} bgImage={bgImage} />)
      setPdf(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
      setPdfError(err.message || String(err))
    } finally {
      setPdfBusy(false)
    }
  }

  return { pdf, pdfBusy, pdfError, generate, clear }
}

function IdCardForm() {
  const { loading, error, result, submit, reset } = useSubmit('/api/members')
  const { pdf, pdfBusy, pdfError, generate, clear } = usePdf()
  const [form, setForm] = useState({ full_name: '', address: '', blood_group: 'A+', emergency_contact: '', photo: '' })

  const handlePhoto = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => setForm((f) => ({ ...f, photo: downscaleToPassport(img) }))
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const clearPhoto = () => setForm((f) => ({ ...f, photo: '' }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { full_name: form.full_name, address: form.address, blood_group: form.blood_group, emergency_contact: form.emergency_contact }
    const data = await submit(payload)
    if (data) generate(() => import('../pdfs/IdCardPDF'), { ...data, photo: form.photo || null })
  }

  const handleReset = () => {
    clear()
    reset()
    setForm({ full_name: '', address: '', blood_group: 'A+', emergency_contact: '', photo: '' })
  }

  if (result) {
    return (
      <SuccessCard
        title="Membership ID Card"
        result={result}
        pdf={pdf}
        pdfBusy={pdfBusy}
        error={pdfError}
        filename={`RHRS-ID-${result.member_id}.pdf`}
        onReset={handleReset}
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-saffron/30 rounded-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-saffron via-gold to-saffron" />
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6 lg:mb-8">
          <img src="/logo.png" alt="RHRS Logo" className="w-16 h-16 mx-auto object-contain mb-4" draggable="false" />
          <h3 className="font-heading text-lg font-bold text-ink">Rashtriya Hindu Rakshak Sangh</h3>
          <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Membership Identity Card</p>
        </div>
        <form className="space-y-4 lg:space-y-5 mb-2" onSubmit={handleSubmit}>
          <div>
            <Label>Full Name</Label>
            <input type="text" required placeholder="Your name" className="input-field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <Label>Address</Label>
            <input type="text" required placeholder="Your full address" className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Blood Group</Label>
              <select className="input-field" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })}>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
            <div>
              <Label>Emergency Contact</Label>
              <input type="tel" required placeholder="Phone number" className="input-field" value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Passport Size Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-[74px] rounded-sm border-2 border-dashed border-saffron/50 bg-saffron-bg overflow-hidden flex items-center justify-center shrink-0">
                {form.photo ? (
                  <img src={form.photo} alt="passport" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-ink-muted/60 text-center leading-tight px-1">PHOTO<br />फोटो</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-block text-xs font-bold uppercase tracking-wider border border-saffron/40 text-saffron px-4 py-2 rounded-sm hover:bg-saffron hover:text-white transition-all duration-200 cursor-pointer">
                  {form.photo ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
                {form.photo && (
                  <button type="button" onClick={clearPhoto} className="block text-[11px] text-red-600 underline cursor-pointer">
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-ink-muted/60 mt-1.5">JPEG / PNG · card ke photo section me lagegi</p>
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}
          <button type="submit" className="w-full btn-saffron" disabled={loading}>
            {loading ? 'Generating…' : '◈ Generate ID Card'}
          </button>
        </form>
        <p className="text-xs text-ink-muted/50 text-center mt-3">Printable PDF · Lifetime validity · Record saved</p>
      </div>
    </motion.div>
  )
}

function AppointmentForm() {
  const { loading, error, result, submit, reset } = useSubmit('/api/appointments')
  const { pdf, pdfBusy, pdfError, generate, clear } = usePdf()
  const [form, setForm] = useState({ full_name: '', designation: 'Office Meeting', from_date: '', duration: '10:00' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await submit(form)
    if (data) generate(() => import('../pdfs/AppointmentPDF'), data, '/appointment-bg.jpg')
  }

  const handleReset = () => {
    clear()
    reset()
    setForm({ full_name: '', designation: 'Office Meeting', from_date: '', duration: '10:00' })
  }

  if (result) {
    return (
      <SuccessCard
        title="Appointment Letter"
        result={result}
        pdf={pdf}
        pdfBusy={pdfBusy}
        error={pdfError}
        filename={`RHRS-APPT-${result.appointment_no}.pdf`}
        onReset={handleReset}
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-saffron/30 rounded-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-gold via-saffron to-gold" />
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6 lg:mb-8">
          <span className="text-4xl block mb-3 text-saffron">▣</span>
          <h3 className="font-heading text-lg font-bold text-ink">Appointment Letter</h3>
          <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Meeting appointment · proof of booking</p>
        </div>
        <form className="space-y-4 lg:space-y-5 mb-2" onSubmit={handleSubmit}>
          <div>
            <Label>Full Name</Label>
            <input type="text" required placeholder="Your name" className="input-field" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <Label>Purpose of Visit</Label>
            <select className="input-field" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}>
              <option>Office Meeting</option><option>Membership Enquiry</option><option>Seva Proposal</option>
              <option>Donation / Contribution</option><option>Personal Meeting</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Appointment Date</Label>
              <input type="date" required className="input-field" value={form.from_date} onChange={(e) => setForm({ ...form, from_date: e.target.value })} />
            </div>
            <div>
              <Label>Appointment Time</Label>
              <input type="time" required className="input-field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}
          <button type="submit" className="w-full btn-saffron" disabled={loading}>
            {loading ? 'Generating…' : '▣ Generate Appointment Letter'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

function PaymentForm({ pendingAmount }) {
  const { loading, error, result, submit, reset } = useSubmit('/api/payments')
  const { pdf, pdfBusy, pdfError, generate, clear } = usePdf()
  const [form, setForm] = useState({ donor_name: '', donation_type: 'General Donation', amount: '', payment_mode: 'UPI', txn_ref: '' })

  useEffect(() => {
    if (pendingAmount && Number(pendingAmount) > 0) {
      setForm((f) => ({ ...f, amount: String(pendingAmount) }))
    }
  }, [pendingAmount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await submit({ ...form, amount: Number(form.amount) })
    if (data) generate(() => import('../pdfs/PaymentSlipPDF'), data, '/appointment-bg.jpg')
  }

  const handleReset = () => {
    clear()
    reset()
    setForm({ donor_name: '', donation_type: 'General Donation', amount: '', payment_mode: 'UPI', txn_ref: '' })
  }

  if (result) {
    return (
      <SuccessCard
        title="Donation Payment Slip"
        result={result}
        pdf={pdf}
        pdfBusy={pdfBusy}
        error={pdfError}
        filename={`RHRS-RCPT-${result.receipt_no}.pdf`}
        onReset={handleReset}
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-saffron/30 rounded-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-saffron via-gold to-saffron" />
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6 lg:mb-8">
          <span className="text-4xl block mb-3 text-saffron">✦</span>
          <h3 className="font-heading text-lg font-bold text-ink">Donation Payment Slip</h3>
          <p className="text-xs text-ink-muted uppercase tracking-wider mt-1">Official Receipt</p>
        </div>
        <form className="space-y-4 lg:space-y-5 mb-2" onSubmit={handleSubmit}>
          <div>
            <Label>Donor Name</Label>
            <input type="text" required placeholder="Your name" className="input-field" value={form.donor_name} onChange={(e) => setForm({ ...form, donor_name: e.target.value })} />
          </div>
          <div>
            <Label>Donation Type</Label>
            <select className="input-field" value={form.donation_type} onChange={(e) => setForm({ ...form, donation_type: e.target.value })}>
              <option>General Donation</option><option>Temple Restoration Fund</option><option>Legal Aid Fund</option>
              <option>Disaster Relief Fund</option><option>Education & Scholarship</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount (₹)</Label>
              <input type="number" required min="1" placeholder="Amount" className="input-field" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <div className="flex gap-2 mt-2">
                {['501', '1001', '5001', '11001'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setForm({ ...form, amount: amt })}
                    className={`flex-1 border text-[11px] font-bold py-1.5 rounded-sm transition-all duration-200 cursor-pointer ${
                      form.amount === amt ? 'bg-saffron text-white border-saffron' : 'border-saffron/30 text-saffron hover:bg-saffron hover:text-white'
                    }`}
                  >₹{Number(amt).toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Payment Mode</Label>
              <select className="input-field" value={form.payment_mode} onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}>
                <option>UPI</option><option>Bank Transfer</option><option>Card</option><option>Cash</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Transaction / UPI Ref</Label>
            <input type="text" required placeholder="TXN ID" className="input-field" value={form.txn_ref} onChange={(e) => setForm({ ...form, txn_ref: e.target.value })} />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">⚠ {error}</p>}
          <button type="submit" className="w-full btn-saffron" disabled={loading}>
            {loading ? 'Generating…' : '✦ Generate Payment Slip'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default function IdCard() {
  const [tab, setTab] = useState('idcard')
  const [donateAmount, setDonateAmount] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setDonateAmount(e.detail ?? null)
      setTab('payment')
    }
    window.addEventListener('rhs:donate', handler)
    return () => window.removeEventListener('rhs:donate', handler)
  }, [])

  return (
    <section id="idcard" className="bg-saffron-bg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ सदस्य सेवाएँ ॥</p>
          <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Member Services</h2>
          <p className="text-sm text-ink-muted mt-3">ID Card · Appointment Letter · Donation Payment Slip</p>
        </div>

        <div className="flex justify-center mb-10 lg:mb-12">
          <div className="inline-flex bg-white border border-border rounded-sm p-1 gap-1 shadow-sm">
            {[
              { id: 'idcard', label: '◈ ID Card' },
              { id: 'appointment', label: '▣ Appointment' },
              { id: 'payment', label: '✦ Payment Slip' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-sm ${
                  tab === t.id ? 'bg-saffron text-white shadow-sm' : 'text-ink-muted hover:text-ink bg-transparent'
                }`}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="max-w-lg lg:max-w-xl mx-auto">
          {tab === 'idcard' && <IdCardForm />}
          {tab === 'appointment' && <AppointmentForm />}
          {tab === 'payment' && <PaymentForm pendingAmount={donateAmount} />}
        </div>
      </div>
    </section>
  )
}
