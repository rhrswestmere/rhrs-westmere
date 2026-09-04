import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found — RHRS'
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-28 lg:py-36">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
              <img src="/logo.png" alt="Rashtriya Hindu Rakshak Sangh (RHRS) Logo" className="w-20 h-20 mx-auto object-contain mb-6" draggable="false" />
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-2">॥ धर्मो रक्षति रक्षितः ॥</p>
              <h1 className="font-heading text-7xl lg:text-9xl font-bold text-white leading-none mb-2">404</h1>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-6" />
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-saffron-light mb-3">Page not found</h2>
              <p className="font-deva text-gold/80 text-sm mb-2">जो पृष्ठ आप ढूँढ रहे हैं वह मौजूद नहीं है</p>
              <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist, may have been moved, or the link is incorrect.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/" className="btn-saffron">◈ Back to Home</Link>
                <Link to="/about" className="border border-saffron/40 text-saffron text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-saffron hover:text-white transition-all duration-200 cursor-pointer">
                  About RHRS
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