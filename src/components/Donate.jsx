import { motion } from 'framer-motion'
import { useState } from 'react'

const bankDetails = [
  { label: 'Account Name', value: 'RHRS Foundation' },
  { label: 'Account Number', value: '1649104000139816', mono: true },
  { label: 'IFSC Code', value: 'IBKL0001649', mono: true },
  { label: 'Bank', value: 'IDBI Bank' },
]

const reasons = [
  'Protect Hindus facing injustice and persecution',
  'Preserve and restore ancient temples',
  'Fund legal aid for victims of hate crimes',
  'Support widows, orphans, and the underprivileged',
  'Disaster relief and rehabilitation',
]

export default function Donate() {
  const [amount, setAmount] = useState('')

  const goToPayment = (amt) => {
    const value = Number(amt)
    if (!value || value <= 0) return
    window.dispatchEvent(new CustomEvent('rhs:donate', { detail: value }))
    document.getElementById('idcard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="donate" className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ दान ही धर्म है ॥</p>
          <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Support the Cause</h2>
          <p className="text-sm lg:text-base text-ink-muted max-w-2xl mx-auto mt-3">Your donation protects Hindu Dharma, supports victims of injustice, and preserves our heritage.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5 lg:space-y-6">
            <div className="bg-gradient-to-br from-saffron-bg to-amber-50 border border-saffron/20 rounded-sm p-6 lg:p-8">
              <h3 className="font-heading text-xl font-bold text-ink mb-5 flex items-center gap-2"><span className="text-saffron shrink-0">◈</span> Bank Details</h3>
              <div className="space-y-3.5 text-sm">
                {bankDetails.map((d) => (
                  <div key={d.label} className="flex justify-between items-center border-b border-border/60 pb-2.5 last:border-0">
                    <span className="text-ink-muted text-xs">{d.label}</span>
                    <span className={`font-bold text-ink text-sm text-right ${d.mono ? 'font-mono tracking-wider' : ''}`}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink border border-saffron/20 rounded-sm p-6 lg:p-8">
              <h3 className="font-heading text-base font-bold text-white mb-4 flex items-center gap-2"><span className="text-gold shrink-0">✦</span> Why Donate?</h3>
              <ul className="space-y-2.5">
                {reasons.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-saffron-light text-xs mt-0.5 shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="border border-saffron/30 rounded-sm p-6 lg:p-8 bg-gradient-to-br from-ivory to-saffron-bg">
              <h3 className="font-heading text-lg font-bold text-ink text-center mb-6">Scan to Donate</h3>
              <div className="w-44 h-44 mx-auto bg-white border-2 border-border mb-5 flex items-center justify-center p-2">
                <img src="/qr-code.png" alt="UPI QR Code" className="w-full h-full object-contain" />
              </div>
              <p className="text-xs text-ink-muted text-center mb-5">Scan with any UPI app (GPay · PhonePe · PayTM)</p>
              <p className="font-deva text-saffron text-sm font-semibold text-center mb-6">ॐ दानाद् धर्मः प्रवर्तते</p>

              <div className="pt-6 border-t border-border">
                <h4 className="font-heading text-base font-bold text-ink text-center mb-4">Quick Donation</h4>
                <div className="flex gap-2 mb-4">
                  {['501', '1001', '5001', '11001'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => goToPayment(amt)}
                      className={`flex-1 border text-xs font-bold py-2.5 transition-all duration-200 cursor-pointer ${
                        amount === amt ? 'bg-saffron text-white border-saffron' : 'border-saffron/30 text-saffron hover:bg-saffron hover:text-white'
                      }`}
                    >₹{Number(amt).toLocaleString('en-IN')}</button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom Amount (₹)"
                  className="input-field mb-4"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button className="w-full btn-saffron" onClick={() => goToPayment(amount)}>◈ Donate Now</button>
                <p className="text-[10px] text-ink-muted text-center mt-3">Donate karke Payment Slip apne aap generate ho jayega</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
