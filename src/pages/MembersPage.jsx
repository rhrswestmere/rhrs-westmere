import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getJSON } from '../lib/api'
import { DESIGNATION_LEVELS, DESIGNATION_LABELS } from '../admin/designations'

const LEVEL_RANK = Object.fromEntries(DESIGNATION_LEVELS.map((level, i) => [level, i]))

const HONORIFICS = new Set(['mr', 'mrs', 'ms', 'miss', 'shri', 'smt', 'kum', 'dr', 'prof', 'ca', 'adv'])

const initialsOf = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter((word) => !HONORIFICS.has(word.replace(/[.\s]/g, '').toLowerCase()))
    .slice(0, 2)
    .map((word) => (word[0] || '').toUpperCase())
    .join('')

export default function MembersPage() {
  useEffect(() => {
    document.title = 'Our Members — RHRS | Rashtriya Hindu Rakshak Sangh Directory'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Meet the registered members of Rashtriya Hindu Rakshak Sangh — the volunteers and office bearers serving the community across India.')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://rhrs.co.in/members')
  }, [])

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    getJSON('/api/members')
      .then((data) => { if (!cancelled) setMembers(Array.isArray(data) ? data : []) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const designated = members.filter((m) => m.designation_title).length

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? members.filter((m) =>
          [m.full_name, m.designation_title, m.designation_number]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(q)),
        )
      : members
    return [...matched].sort((a, b) => {
      const ra = a.designation_level != null ? LEVEL_RANK[a.designation_level] ?? 99 : 99
      const rb = b.designation_level != null ? LEVEL_RANK[b.designation_level] ?? 99 : 99
      if (ra !== rb) return ra - rb
      return String(a.full_name).localeCompare(String(b.full_name))
    })
  }, [members, query])

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ हमारे सदस्य ॥</p>
            <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-6" />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">Our Members</h1>
            <p className="font-deva text-saffron-light/80 text-sm lg:text-base mt-4 mb-5">॥ संगठन ही हमारी शक्ति है ॥</p>
            <p className="text-sm lg:text-base text-white/50 max-w-2xl mx-auto">
              The faces behind the flag — registered members and office bearers of Rashtriya Hindu Rakshak Sangh,
              serving the community from the national level down to every mandal.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-10">
              <div className="text-center bg-saffron-bg border border-saffron/20 rounded-sm p-4">
                <div className="font-heading text-xl lg:text-2xl font-bold text-saffron">{members.length}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">Total Members</div>
              </div>
              <div className="text-center bg-ivory-dark border border-border rounded-sm p-4">
                <div className="font-heading text-xl lg:text-2xl font-bold text-ink">{designated}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">Office Bearers</div>
              </div>
            </div>

            {!loading && !error && members.length > 0 && (
              <div className="max-w-md mx-auto mb-10">
                <input
                  type="search"
                  className="input-field"
                  placeholder="Search by name or designation…"
                  aria-label="Search members"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <p className="text-[11px] text-ink-muted text-center mt-2">
                    {visible.length} of {members.length} members
                  </p>
                )}
              </div>
            )}

            {loading && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-saffron-bg/60 animate-pulse rounded-sm aspect-[4/5]" />
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm py-8 max-w-xl mx-auto">
                ⚠ Members load nahi ho paye: {error}
              </p>
            )}

            {!loading && !error && visible.length === 0 && (
              <p className="text-center text-sm text-ink-muted py-8">
                {query ? 'Koi member is naam ya designation se match nahi hua.' : 'Directory abhi update ho rahi hai — jald hi yahan saare members dikhenge.'}
              </p>
            )}

            {!loading && !error && visible.length > 0 && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                {visible.map((m, i) => (
                  <motion.article
                    key={m.member_id || m.full_name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.03 }}
                    className="group bg-white border border-border rounded-sm overflow-hidden hover:border-saffron/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-saffron-bg via-ivory to-ivory-dark">
                      {m.photo_url ? (
                        <img
                          src={m.photo_url}
                          alt={m.full_name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <span className="font-heading text-3xl font-bold text-saffron/70">{initialsOf(m.full_name)}</span>
                          <span className="text-saffron/20 text-3xl">◈</span>
                        </div>
                      )}
                      {m.designation_level && (
                        <span className="absolute top-3 left-3 bg-ink/85 text-saffron text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                          {DESIGNATION_LABELS[m.designation_level] || m.designation_level}
                        </span>
                      )}
                    </div>
                    <div className="p-4 lg:p-5 border-t border-saffron/15">
                      <h3 className="font-heading text-base font-bold text-ink leading-snug">{m.full_name}</h3>
                      <p className="text-[11px] font-bold text-saffron uppercase tracking-wider mt-1.5">
                        {m.designation_title || 'Active Member'}
                      </p>
                      {m.designation_number && (
                        <p className="text-[10px] font-mono text-ink-muted mt-1.5">{m.designation_number}</p>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {!loading && !error && visible.length > 0 && (
              <p className="text-center text-xs text-ink-muted mt-10">
                Ye directory keval active members ko dikhati hai — records admin panel se manage kiye jaate hain.
              </p>
            )}
          </div>
        </section>

        <section className="bg-ink">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ हमसे जुड़ें ॥</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">Want to Be on This List?</h2>
            <p className="text-sm text-white/45 max-w-xl mx-auto mb-8">
              Generate your membership ID card online — your record is created instantly and you become part of the RHRS family.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/#idcard" className="px-6 py-3 bg-saffron text-white text-sm font-semibold rounded-sm hover:bg-saffron-deep transition-all uppercase tracking-wider">▣ Get ID Card</Link>
              <Link to="/#donate" className="px-6 py-3 border border-gold/20 text-gold-light text-sm font-semibold rounded-sm hover:bg-gold/10 transition-all uppercase tracking-wider">✦ Support the Cause</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
