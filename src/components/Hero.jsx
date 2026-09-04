import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="pt-16 lg:pt-20 relative bg-cover" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.80) 0%, rgba(42,31,10,0.74) 35%, rgba(58,42,16,0.70) 65%, rgba(26,17,0,0.80) 100%), url("/hero-bg.png")', backgroundPosition: 'center 26%' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Rashtriya Hindu Rakshak Sangh (RHRS) Logo" className="w-12 h-12 lg:w-14 lg:h-14 object-contain drop-shadow-lg shrink-0" draggable="false" />
              <div>
                <p className="font-deva text-saffron-light text-sm lg:text-base font-semibold leading-tight">॥ धर्मो रक्षति रक्षितः ॥</p>
                <p className="text-[11px] text-white/30">Est. 2026 | Nationwide</p>
              </div>
            </div>

            <h1 className="font-heading font-bold text-white mb-4">
              <span className="text-4xl lg:text-5xl block leading-tight">Rashtriya Hindu</span>
              <span className="text-5xl lg:text-7xl block leading-[1.05] text-saffron-light">Rakshak Sangh</span>
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-16 bg-saffron rounded-full shrink-0" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.15em]">राष्ट्रिय हिन्दू रक्षक संघ</span>
            </div>

            <p className="text-sm lg:text-base text-white/50 leading-relaxed max-w-xl mb-3">
              Dedicated to the <span className="text-white/80 font-semibold">protection of Hindu Dharma</span>,
              preservation of our sacred heritage, and selfless service to the nation.
            </p>
            <p className="font-deva text-saffron-light/85 text-sm lg:text-base leading-relaxed max-w-xl mb-8">
              जय श्रीराम। हिन्दू धर्म, संस्कृति और राष्ट्र की रक्षा हेतु समर्पित — यही हमारा जन्मसिद्ध कर्तव्य है।
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#helpline" className="px-6 py-3 bg-saffron text-white text-sm font-semibold rounded-sm hover:bg-saffron-deep transition-all uppercase tracking-wider inline-flex items-center gap-2">
                ◈ Helpline
              </a>
              <a href="#donate" className="px-6 py-3 border border-gold/20 text-gold-light text-sm font-semibold rounded-sm hover:bg-gold/10 transition-all uppercase tracking-wider inline-flex items-center gap-2">
                ✦ Support
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="hidden lg:flex items-center justify-center">
            <div className="w-72 h-72 xl:w-80 xl:h-80 border border-saffron/15 rounded-full flex items-center justify-center">
              <div className="w-56 h-56 xl:w-64 xl:h-64 border border-gold/10 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl lg:text-7xl mb-3 text-saffron/40">◈</div>
                  <p className="font-deva text-sm text-saffron-light/60">॥ रक्षा करो महादेव ॥</p>
                  <div className="flex justify-center gap-2 mt-2">
                    {[0, 1, 2].map((i) => (<span key={i} className="text-gold/40 text-lg">✦</span>))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
