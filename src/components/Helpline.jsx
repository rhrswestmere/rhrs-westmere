import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const FALLBACK = [
  { number: '1800-123-HELP (4357)', label: 'National Helpline', icon: '✦', description: '24×7 Free Legal & Emergency Aid' },
  { number: '+91 99999-11111', label: 'Women Protection', icon: '◈', description: 'Immediate assistance for women in distress' },
  { number: '+91 99999-22222', label: 'Cultural Rights', icon: '◇', description: 'Report temple desecration & hate crimes' },
  { number: '+91 99999-33333', label: 'Disaster Relief', icon: '▣', description: 'Flood, earthquake & calamity response' },
]

export default function Helpline() {
  const [helplines, setHelplines] = useState(FALLBACK)

  useEffect(() => {
    fetch('/api/helplines')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setHelplines(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="helpline" style={{ background: 'linear-gradient(180deg, #1A1100 0%, #2A1F0A 50%, #1A1100 100%)' }}>
      <div className="section-divider" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-deva text-saffron text-base lg:text-lg font-bold mb-2">॥ रक्षा ही धर्म है ॥</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">Emergency Helplines</h2>
          <p className="text-sm text-white/25 mt-3 max-w-lg mx-auto">किसी भी संकट में हमसे संपर्क करें — 24×7 सेवा</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {helplines.map((item, i) => (
            <motion.div key={item.id || item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group border border-saffron/15 hover:border-saffron/40 rounded-sm p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-saffron-light/60 text-3xl block mb-4 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <h3 className="text-saffron-light text-xs font-bold uppercase tracking-wider mb-2">{item.label}</h3>
              <p className="font-heading text-lg lg:text-xl font-bold text-white mb-2 tracking-wide">{item.number}</p>
              <p className="text-sm text-white/25">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-white/12 mt-8 font-deva">सभी सेवाएँ निःशुल्क हैं | All services are free</p>
      </div>
    </section>
  )
}
