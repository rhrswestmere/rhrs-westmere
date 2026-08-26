import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getJSON } from '../lib/api'

function PhotoCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative h-52 bg-gradient-to-br from-saffron-bg to-amber-50 border border-border hover:border-saffron/30 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
    >
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-saffron/20 text-6xl">◈</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-5 lg:p-6">
        <h3 className="font-heading text-sm font-bold text-white">{item.title}</h3>
        {item.caption && <p className="text-[11px] text-white/50 mt-0.5">{item.caption}</p>}
      </div>
    </motion.div>
  )
}

function IssueCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative h-52 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 hover:border-red-400 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
    >
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-300/30 text-6xl">⚡</span>
        </div>
      )}
      <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Alert</div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-5 lg:p-6">
        <h3 className="font-heading text-sm font-bold text-white">{item.title}</h3>
        {item.caption && <p className="text-[11px] text-red-300 font-medium mt-0.5">{item.caption}</p>}
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [tab, setTab] = useState('events')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getJSON('/api/gallery')
      .then((data) => { if (!cancelled) setPhotos(Array.isArray(data) ? data : []) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const events = photos.filter((p) => p.category === 'events')
  const issues = photos.filter((p) => p.category === 'issues')

  return (
    <section id="gallery" className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ दृश्य संग्रह ॥</p>
          <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Gallery</h2>
        </div>

        <div className="flex justify-center mb-10 lg:mb-12">
          <div className="inline-flex bg-saffron-bg rounded-sm p-1 gap-1">
            <button onClick={() => setTab('events')} className={`tab-btn ${tab === 'events' ? 'active' : 'inactive'}`}>◈ Events</button>
            <button onClick={() => setTab('issues')} className={`tab-btn ${tab === 'issues' ? 'active' : 'inactive'}`}>⚠ Issues & Alerts</button>
          </div>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 bg-saffron-bg/60 animate-pulse rounded-sm" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm py-8 max-w-xl mx-auto">
            ⚠ Gallery load nahi ho payi: {error}
          </p>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            {tab === 'events' ? (
              <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {events.map((item) => <PhotoCard key={item.id} item={item} />)}
              </motion.div>
            ) : (
              <motion.div key="issues" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {issues.map((item) => <IssueCard key={item.id} item={item} />)}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!loading && !error && (tab === 'events' ? events.length : issues.length) === 0 && (
          <p className="text-center text-sm text-ink-muted py-8">Abhi koi photos nahi hain. Admin panel se gallery manage ki ja sakti hai.</p>
        )}
      </div>
    </section>
  )
}
