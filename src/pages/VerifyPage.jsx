import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const fmtDate = (iso) => {
  if (!iso) return '---'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '---' }
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams()
  const memberId = searchParams.get('memberId')
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Verify Member — RHRS'
    if (!memberId) {
      setError('No member ID provided.')
      setLoading(false)
      return
    }
    fetch(`/api/verify?memberId=${encodeURIComponent(memberId)}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Member not found')
        setMember(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [memberId])

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink min-h-screen" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[500px] mx-auto px-4 py-12 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Header */}
              <div className="text-center mb-8">
                <img src="/logo.png" alt="RHRS Logo" className="w-16 h-16 mx-auto object-contain mb-4" draggable="false" />
                <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ धर्मो रक्षति रक्षितः ॥</p>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-1">Member Verification</h1>
                <p className="text-white/50 text-xs">Rashtriya Hindu Rakshak Sangh</p>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-saffron/30 border-t-saffron rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/50 text-sm">Verifying member...</p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="bg-red-900/30 border border-red-500/40 rounded-sm p-6 text-center">
                  <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2">Verification Failed</p>
                  <p className="text-red-300/70 text-xs">{error}</p>
                </div>
              )}

              {/* Member Card */}
              {member && !loading && (
                <div className="bg-ivory rounded-sm overflow-hidden border border-border">
                  {/* Status Banner */}
                  <div className={`px-5 py-3 ${member.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                    <p className="text-white text-xs font-bold uppercase tracking-wider text-center">
                      {member.isActive ? '✓ Active Member' : '✗ Inactive Member'}
                    </p>
                  </div>

                  {/* Member Info */}
                  <div className="p-6 space-y-5">
                    {/* Name + ID */}
                    <div className="text-center border-b border-border pb-5">
                      <h2 className="font-heading text-xl lg:text-2xl font-bold text-ink mb-1">{member.name}</h2>
                      <p className="font-mono text-xs text-ink-muted tracking-wider">{member.memberId}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3">
                      <DetailRow label="Designation" value={member.designation} />
                      {member.designationNumber && (
                        <DetailRow label="Designation No" value={member.designationNumber} />
                      )}
                      <DetailRow label="Blood Group" value={member.bloodGroup} />
                      <DetailRow label="Mobile" value={member.mobile} />
                      <DetailRow label="Registered" value={fmtDate(member.createdAt)} />
                      <DetailRow label="Valid Upto" value={fmtDate(member.validUpto)} highlight />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gold-bg px-5 py-3 border-t border-border">
                    <p className="text-[10px] text-ink-muted text-center uppercase tracking-wider">
                      This card is the property of RHRS — rhrs.co.in
                    </p>
                  </div>
                </div>
              )}

              {/* Back Link */}
              <div className="text-center mt-8">
                <Link to="/" className="text-saffron text-xs font-bold uppercase tracking-wider hover:text-saffron-light transition-colors">
                  ← Back to RHRS Website
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-saffron' : 'text-ink'}`}>{value || '---'}</span>
    </div>
  )
}
