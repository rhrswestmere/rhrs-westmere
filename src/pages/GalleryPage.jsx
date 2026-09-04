import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getJSON } from '../lib/api'

export default function GalleryPage() {
  useEffect(() => {
    document.title = 'Gallery — RHRS | Events, Seva Camps & Community Activities'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'View photos from RHRS events, seva camps, temple restorations, and community welfare activities across India.')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://rhrs.co.in/gallery')
  }, [])
  const [tab, setTab] = useState('events')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let cancelled = false
    getJSON('/api/gallery')
      .then((data) => { if (!cancelled) setPhotos(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const events = photos.filter((p) => p.category === 'events')
  const issues = photos.filter((p) => p.category === 'issues')
  const active = tab === 'events' ? events : issues

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ दृश्य संग्रह ॥</p>
            <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-6" />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">Gallery</h1>
            <p className="font-deva text-saffron-light/80 text-sm lg:text-base mt-4 mb-5">॥ एक झलक हमारे कार्यों की ॥</p>
            <p className="text-sm lg:text-base text-white/50 max-w-2xl mx-auto">
              A glimpse of our shakhas, seva camps, temple restorations, and celebrations across the nation —
              every photograph tells the story of Hindu unity in action.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              <div className="text-center bg-saffron-bg border border-saffron/20 rounded-sm p-4">
                <div className="font-heading text-xl lg:text-2xl font-bold text-saffron">{photos.length}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">Total Photos</div>
              </div>
              <div className="text-center bg-ivory-dark border border-border rounded-sm p-4">
                <div className="font-heading text-xl lg:text-2xl font-bold text-ink">{events.length}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">Events</div>
              </div>
              <div className="text-center bg-red-50 border border-red-200 rounded-sm p-4">
                <div className="font-heading text-xl lg:text-2xl font-bold text-red-600">{issues.length}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">Issues & Alerts</div>
              </div>
            </div>

            <div className="flex justify-center mb-10 lg:mb-12">
              <div className="inline-flex bg-saffron-bg rounded-sm p-1 gap-1">
                <button onClick={() => setTab('events')} className={`tab-btn ${tab === 'events' ? 'active' : 'inactive'}`}>◈ Events</button>
                <button onClick={() => setTab('issues')} className={`tab-btn ${tab === 'issues' ? 'active' : 'inactive'}`}>⚠ Issues & Alerts</button>
              </div>
            </div>

            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-64 bg-saffron-bg/60 animate-pulse rounded-sm" />
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
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
                >
                  {active.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => setLightbox(item)}
                      className={`relative h-64 lg:h-72 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group ${tab === 'events' ? 'bg-gradient-to-br from-saffron-bg to-amber-50 border border-border hover:border-saffron/30' : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 hover:border-red-400'}`}
                    >
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-saffron/20 text-6xl">◈</span>
                        </div>
                      )}
                      {tab === 'issues' && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Alert</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-5 lg:p-6">
                        <h3 className="font-heading text-base font-bold text-white">{item.title}</h3>
                        {item.caption && <p className={`text-[11px] mt-1 ${tab === 'issues' ? 'text-red-300' : 'text-white/60'}`}>{item.caption}</p>}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && !error && active.length === 0 && (
              <p className="text-center text-sm text-ink-muted py-8">
                Abhi is category mein koi photos nahi hain. Admin panel se gallery manage ki ja sakti hai.
              </p>
            )}

            <p className="text-center text-xs text-ink-muted mt-10">
              Photos yahan admin panel ke through update ki jaati hain — nayi photos ke liye gallery refresh hoti rehti hai.
            </p>
          </div>
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
          >
            <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white text-xl rounded-sm transition-colors">✕</button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              {lightbox.image_url && (
                <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[70vh] object-contain rounded-sm bg-ink/40" />
              )}
              <div className="mt-4 text-center">
                <h3 className="font-heading text-lg font-bold text-white">{lightbox.title}</h3>
                {lightbox.caption && <p className="text-sm text-white/60 mt-1">{lightbox.caption}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
