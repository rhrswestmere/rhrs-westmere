import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const stats = [
  { value: '500+', label: 'Cities Covered' },
  { value: '2L+', label: 'Active Members' },
  { value: '50K+', label: 'Cases Helped' },
  { value: '15+', label: 'Years of Seva' },
]

const cards = [
  { icon: '◈', title: 'Our Vision', hi: 'हमारा दृष्टिकोण', desc: 'A fearless, united, and prosperous Hindu society where every Hindu lives with dignity, security, and pride in their Dharma.' },
  { icon: '✦', title: 'Our Mission', hi: 'हमारा लक्ष्य', desc: 'To protect every Hindu from injustice, preserve our sacred heritage, promote Hindu unity, and serve humanity.' },
  { icon: '◇', title: 'Our Pledge', hi: 'हमारा संकल्प', desc: 'We stand with every Hindu in need, raise our voice against injustice, and protect our temples and traditions.' },
]

const pillars = [
  { icon: '🏛️', title: 'Cultural Heritage', hi: 'सांस्कृतिक विरासत', desc: 'Preserving Hindu art, architecture, music, philosophy, and rituals through festivals, workshops, heritage walks, and temple restoration projects across the sacred land of Bharat.' },
  { icon: '🤝', title: 'Social Welfare', hi: 'समाज कल्याण', desc: 'Providing food, education, healthcare, and shelter to the underprivileged. Our welfare programs reach remote communities in the true spirit of Seva Paramo Dharma.' },
  { icon: '🙏', title: 'Volunteer Services', hi: 'स्वयंसेवक सेवा', desc: 'Building a disciplined force of sevadars who serve selflessly during natural calamities, community events, and daily social upliftment activities.' },
  { icon: '📢', title: 'Public Awareness', hi: 'जन जागरूकता', desc: 'Spreading awareness about Hindu rights, cultural identity, environmental consciousness, and national issues through campaigns, seminars, and digital media.' },
  { icon: '💝', title: 'Community Assistance', hi: 'सामुदायिक सहायता', desc: 'Supporting families with ration kits, medical aid, educational sponsorships, legal assistance, and counseling services for those in need.' },
  { icon: '🤲', title: 'Membership & Unity', hi: 'सदस्यता एवं एकता', desc: 'Uniting Hindus worldwide under a single banner of service and protection. Every member strengthens the collective voice and reach of the community.' },
]

const values = [
  { title: 'Seva Paramo Dharma', hi: 'सेवा परमो धर्मः', desc: 'Service to humanity is our highest worship — we serve without expectation, in the true spirit of Karmayoga.' },
  { title: 'Unity of Hindus', hi: 'हिन्दू एकता', desc: 'A single Hindu is strong, but a united Hindu society is invincible. We work to bring every Hindu under one banner.' },
  { title: 'Courage & Sacrifice', hi: 'साहस एवं त्याग', desc: 'Our sevadars stand unshaken against injustice, ready to sacrifice everything for the protection of Dharma.' },
  { title: 'Discipline & Devotion', hi: 'अनुशासन एवं भक्ति', desc: 'A disciplined, devoted, and upright character is the foundation of both individual life and national strength.' },
]

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About RHRS — Rashtriya Hindu Rakshak Sangh'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Learn about Rashtriya Hindu Rakshak Sangh (RHRS) — our vision, mission, core pillars, values, and nationwide activities for Hindu heritage preservation and social welfare.')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://rhrs.co.in/about')
  }, [])
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ परिचय ॥</p>
            <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-6" />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">About RHRS</h1>
            <p className="font-deva text-saffron-light/80 text-sm lg:text-base mt-4 mb-5">॥ धर्मो रक्षति रक्षितः ॥</p>
            <p className="text-sm lg:text-base text-white/50 max-w-2xl mx-auto">
              Rashtriya Hindu Rakshak Sangh (RHRS) is a nationwide organization born from a single conviction —
              that Hindu Dharma, culture, and civilization must be protected, preserved, and strengthened, generation after generation.
            </p>
          </div>
        </section>

        <section className="bg-saffron-bg">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="bg-white border border-border border-l-4 border-l-saffron rounded-sm p-6 lg:p-10">
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-ink mb-5">हमारा उद्देश्य — Our Purpose</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="font-deva text-sm lg:text-base text-ink-soft leading-relaxed">
                    राष्ट्रीय हिन्दू रक्षक संघ 'धर्मो रक्षति रक्षितः' के सिद्धांत पर स्थापित एक महान राष्ट्रव्यापी संगठन है।
                    हमारा उद्देश्य केवल संगठन नहीं, वरन् हिन्दू समाज को एकसूत्र में बांधकर उसकी चेतना, गौरव और स्वाभिमान को पुनः जाग्रत करना है।
                    यह पवित्र भूमि भारत हिन्दूत्व की आत्मा है — और इस आत्मा की रक्षा ही हमारा परम कर्तव्य है।
                  </p>
                  <p className="text-sm lg:text-base text-ink-soft leading-relaxed">
                    From providing <strong>legal aid</strong> to Hindus facing persecution, to <strong>preserving temples</strong>, and running
                    <strong> social welfare programs</strong> — our work spans every aspect of Hindu life. Our volunteers are on the ground in over 500 cities,
                    in villages and towns across Bharat, standing beside every Hindu in their hour of need.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm lg:text-base text-ink-soft leading-relaxed">
                    We believe that a society which forgets its roots cannot protect its future. That is why our work is built on three eternal principles —
                    <strong> Raksha</strong> (protection), <strong>Seva</strong> (service), and <strong>Sangathan</strong> (organization).
                    Through these, we safeguard the weak, serve the needy, and unite the community into a single, unbreakable family.
                  </p>
                  <p className="text-sm lg:text-base text-ink-soft leading-relaxed">
                    Whether it is rescuing a family in a flood, defending a temple from desecration, educating a child from a poor home, or standing firm for a victim of injustice —
                    RHRS is present wherever Dharma needs a protecting hand. This is not just our work; it is our <strong>sankalp</strong>, our sacred vow to the nation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/80 border border-border rounded-sm p-5 lg:p-6 text-center">
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-saffron">{s.value}</div>
                  <div className="text-[10px] text-ink-muted font-medium uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="text-center mb-12">
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ संकल्प ॥</p>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">What We Stand For</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {cards.map((item) => (
                <div key={item.title} className="group bg-ivory-dark border border-border hover:border-saffron/30 rounded-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="text-saffron text-2xl block mb-3">{item.icon}</span>
                  <h3 className="font-heading text-base font-bold text-ink mb-1 group-hover:text-saffron transition-colors">{item.title}</h3>
                  <p className="font-deva text-xs text-saffron font-semibold mb-3">{item.hi}</p>
                  <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-saffron-bg">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="text-center mb-12">
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ आधार स्तंभ ॥</p>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Our Core Pillars</h2>
              <p className="text-sm lg:text-base text-ink-muted max-w-2xl mx-auto mt-3">
                The foundation of our organization rests on six fundamental pillars that guide every initiative, program, and mission we undertake in service of the nation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="border border-border hover:border-saffron/40 p-6 bg-white hover:bg-saffron-bg/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1">{pillar.icon}</span>
                    <div>
                      <h3 className="font-heading text-base font-bold text-ink mb-1 group-hover:text-saffron transition-colors">{pillar.title}</h3>
                      <p className="font-deva text-xs text-saffron font-semibold mb-2">{pillar.hi}</p>
                      <p className="text-sm text-ink-soft leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="text-center mb-12">
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ मूल्य ॥</p>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="border border-saffron/15 hover:border-saffron/40 rounded-sm p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <p className="font-deva text-saffron-light text-sm font-bold mb-2">{v.hi}</p>
                  <h3 className="font-heading text-sm font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/#helpline" className="px-6 py-3 bg-saffron text-white text-sm font-semibold rounded-sm hover:bg-saffron-deep transition-all uppercase tracking-wider">◈ Helpline</Link>
                <Link to="/#donate" className="px-6 py-3 border border-gold/20 text-gold-light text-sm font-semibold rounded-sm hover:bg-gold/10 transition-all uppercase tracking-wider">✦ Support</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
