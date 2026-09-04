import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const FALLBACK_HELPLINES = [
  { label: 'National Helpline', number: '1800-123-HELP' },
  { label: 'Women Protection', number: '+91 99999-11111' },
  { label: 'Cultural Rights', number: '+91 99999-22222' },
  { label: 'Disaster Relief', number: '+91 99999-33333' },
]

export default function Footer() {
  const [helplines, setHelplines] = useState(FALLBACK_HELPLINES)

  useEffect(() => {
    fetch('/api/helplines')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setHelplines(data)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-ink">
      <div className="section-divider" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="RHRS Logo" className="w-12 h-12 object-contain shrink-0" draggable="false" />
              <div>
                <p className="font-heading text-sm font-bold text-white leading-tight">Rashtriya Hindu</p>
                <p className="font-heading text-[10px] text-saffron-light/50 tracking-wider">Rakshak Sangh</p>
              </div>
            </div>
            <p className="text-xs text-white/35 leading-relaxed max-w-sm mb-3">Dedicated to the protection of Hindu Dharma, preservation of our heritage, and service to the nation.</p>
            <p className="font-deva text-gold/60 text-sm">॥ धर्मो रक्षति रक्षितः ॥</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <p className="text-xs font-bold text-saffron uppercase tracking-wider mb-4">Quick Links</p>
            <div className="space-y-2">
              {[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Services', to: '/services' }, { label: 'Gallery', to: '/gallery' }, { label: 'Donate', to: '/#donate' }, { label: 'Admin Panel', to: '/admin' }].map((l) => (
                <Link key={l.label} to={l.to} className="block text-xs text-white/35 hover:text-saffron-light transition-colors duration-200">{l.label}</Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <p className="text-xs font-bold text-saffron uppercase tracking-wider mb-4">◈ Helpline</p>
            <div className="space-y-2.5">
              {helplines.map((h) => (
                <div key={h.id || h.label}>
                  <p className="text-[9px] text-white/25">{h.label}</p>
                  <a href={`tel:${h.number.replace(/[^0-9+]/g, '')}`} className="text-sm font-bold text-saffron-light hover:text-saffron transition-colors">{h.number}</a>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <p className="text-xs font-bold text-saffron uppercase tracking-wider mb-4">Contact</p>
            <div className="space-y-2.5 text-xs text-white/35">
              <p><span className="text-white/50">Address:</span> 108, Dharma Marg, New Delhi — 110001</p>
              <p>
                <span className="text-white/50">Email:</span>{' '}
                <a href="mailto:contact@rhns.org" className="text-saffron-light hover:text-saffron transition-colors underline underline-offset-2">contact@rhns.org</a>
              </p>
              <p>
                <span className="text-white/50">Phone:</span>{' '}
                <a href="tel:+9118001234567" className="text-saffron-light hover:text-saffron transition-colors underline underline-offset-2">+91 1800-123-4567</a>
              </p>
              <div className="flex gap-2 mt-4">
                {[
                  { label: 'X', href: '#' },
                  { label: 'FB', href: '#' },
                  { label: 'IG', href: '#' },
                  { label: 'YT', href: '#' },
                  { label: 'WA', href: '#' },
                ].map((p) => (
                  <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-white/10 flex items-center justify-center text-[9px] text-white/25 hover:text-saffron-light hover:border-saffron/30 transition-all duration-200 uppercase tracking-wider">{p.label}</a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/20 tracking-wider uppercase">© {new Date().getFullYear()} Rashtriya Hindu Rakshak Sangh (RHRS)</p>
            <p className="font-deva text-sm text-white/20">राष्ट्रिय हिन्दू रक्षक संघ · धर्मो रक्षति रक्षितः</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-white/20 tracking-wider">
              Designed and Developed by{' '}
              <a href="https://westmere.io" target="_blank" rel="noopener noreferrer" className="text-saffron-light hover:text-saffron transition-colors font-semibold">
                Westmere
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
