import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  { icon: '◈', title: 'Legal Protection', hi: 'कानूनी संरक्षण', desc: 'Free legal aid for Hindus facing discrimination, false cases, hate crimes, and temple desecration. A panel of 500+ dedicated lawyers stands guard over Dharma.', points: ['Pro-bono legal counsel', 'False case defence', 'Hate crime support', 'PIL filing'], border: 'border-l-red-400' },
  { icon: '▣', title: 'Temple Protection', hi: 'मंदिर सुरक्षा', desc: 'Monitoring threats, organizing protection committees, restoring ancient temples, and securing pilgrimage routes across the sacred land of Bharat.', points: ['Threat monitoring', 'Protection committees', 'Temple restoration', 'Pilgrimage security'], border: 'border-l-saffron' },
  { icon: '✦', title: 'Human Rights', hi: 'मानवाधिकार', desc: 'Raising voice against atrocities, filing PILs, and engaging with NHRC and international bodies on Hindu rights issues across the globe.', points: ['Atrocity reporting', 'NHRC engagement', 'Global advocacy', 'Awareness campaigns'], border: 'border-l-blue-400' },
  { icon: '◇', title: 'Social Welfare', hi: 'समाज कल्याण', desc: 'Ration kits, medical camps, educational sponsorships, widow support, orphan care, and disaster relief — service in the spirit of Seva Paramo Dharma.', points: ['Ration distribution', 'Free medical camps', 'Widow & orphan care', 'Educational support'], border: 'border-l-green-500' },
  { icon: '◈', title: 'Crisis Response', hi: 'संकट राहत', desc: '24×7 rapid response teams for Hindu communities facing violence, riots, hate campaigns, or natural disasters.', points: ['24×7 helpline', 'Rapid response teams', 'Emergency shelter', 'Relief distribution'], border: 'border-l-orange-400' },
  { icon: '✦', title: 'Women & Child Safety', hi: 'महिला एवं बाल सुरक्षा', desc: 'Special helpline, safe houses, counseling, legal support, and rehabilitation for women and children in distress.', points: ['Women protection helpline', 'Safe houses', 'Counseling support', 'Rehabilitation'], border: 'border-l-pink-400' },
  { icon: '◇', title: 'Global Hindu Network', hi: 'वैश्विक हिन्दू नेटवर्क', desc: 'Connecting Hindus worldwide through international chapters, cultural exchange, community support, and global advocacy.', points: ['International chapters', 'Cultural exchange', 'Community support', 'Global advocacy'], border: 'border-l-purple-400' },
]

const activities = [
  {
    title: 'Heritage Preservation',
    sub: 'सांस्कृतिक संरक्षण',
    desc: 'Restoration of ancient temples, preservation of manuscripts, and revival of traditional arts. We organize heritage walks, lectures, and cultural festivals so that our Sanatana culture lives on, generation after generation.',
    tags: ['Temple Restoration', 'Manuscripts', 'Cultural Festivals'],
  },
  {
    title: 'Disaster Relief',
    sub: 'आपदा राहत',
    desc: 'Rapid response teams deployed during floods, earthquakes, and other calamities. In the true spirit of Hindu seva, we reach the last person first — providing food, shelter, medical aid, and rehabilitation.',
    tags: ['Emergency Response', 'Medical Camps', 'Rehabilitation'],
  },
  {
    title: 'Educational Programs',
    sub: 'शिक्षा कार्यक्रम',
    desc: 'Scholarships for underprivileged students, Vedic schools, computer literacy camps, and career guidance sessions — empowering our youth to stand tall in knowledge and character.',
    tags: ['Scholarships', 'Vedic Schools', 'Digital Literacy'],
  },
  {
    title: 'Health & Wellness',
    sub: 'स्वास्थ्य सेवा',
    desc: 'Free health check-up camps, yoga and meditation sessions, Ayurveda awareness programs, and blood donation drives organized nationwide — for a healthy body and a pure soul.',
    tags: ['Health Camps', 'Yoga & Meditation', 'Blood Donation'],
  },
  {
    title: 'Environmental Care',
    sub: 'पर्यावरण संरक्षण',
    desc: 'Tree plantation drives, river cleaning campaigns, cow protection programs, and sustainable living workshops rooted in our traditional eco-conscious values.',
    tags: ['Plantation', 'River Cleaning', 'Gau Sewa'],
  },
  {
    title: 'Legal Aid & Rights',
    sub: 'कानूनी सहायता',
    desc: 'Free legal counseling for those in need, awareness camps on Hindu rights, and firm support for cases involving discrimination and the protection of our culture.',
    tags: ['Legal Camps', 'Rights Awareness', 'Pro Bono'],
  },
]

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'Our Services — RHRS | Legal Aid, Temple Protection, Social Welfare'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Explore RHRS services — free legal protection, temple protection, human rights advocacy, social welfare, crisis response, women & child safety, and global Hindu network.')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://rhrs.co.in/services')
  }, [])
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-16 lg:pt-20 bg-ink" style={{ backgroundImage: 'linear-gradient(140deg, rgba(26,17,0,0.94) 0%, rgba(42,31,10,0.90) 40%, rgba(58,42,16,0.88) 70%, rgba(26,17,0,0.94) 100%)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ हमारी सेवाएँ ॥</p>
            <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-6" />
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white leading-tight">Our Services</h1>
            <p className="font-deva text-saffron-light/80 text-sm lg:text-base mt-4 mb-5">॥ सेवा परमो धर्मः ॥</p>
            <p className="text-sm lg:text-base text-white/50 max-w-2xl mx-auto">
              From legal protection to humanitarian aid — RHRS serves the Hindu community across every domain of need.
              Every service is delivered selflessly, by trained sevadars, free of cost to those who need it most.
            </p>
          </div>
        </section>

        <section className="bg-ivory-dark">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="text-center mb-12">
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ क्षेत्र ॥</p>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Domains of Service</h2>
              <p className="text-sm lg:text-base text-ink-muted max-w-2xl mx-auto mt-3">
                Each domain is led by dedicated teams of legal experts, doctors, counselors, and community volunteers working around the clock.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`${s.border} border-l-4 group bg-white border border-border hover:border-saffron/30 rounded-sm p-5 lg:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <span className="text-saffron text-xl block mb-3">{s.icon}</span>
                  <h3 className="font-heading text-sm font-bold text-ink mb-1 group-hover:text-saffron transition-colors duration-300">{s.title}</h3>
                  <p className="font-deva text-[11px] text-saffron font-semibold mb-2">{s.hi}</p>
                  <p className="text-xs text-ink-soft/80 leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-1.5">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-1.5 text-[11px] text-ink-muted">
                        <span className="text-saffron mt-0.5">✦</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
            <div className="text-center mb-12">
              <p className="font-deva text-saffron text-xs font-bold uppercase tracking-[0.15em] mb-1">॥ कार्य ॥</p>
              <div className="w-[60px] h-[3px] bg-saffron mx-auto mb-5" />
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-ink">Our Activities on the Ground</h2>
              <p className="text-sm lg:text-base text-ink-muted max-w-2xl mx-auto mt-3">
                Beyond our service domains, our volunteers run year-round activities that touch the daily lives of our communities.
              </p>
            </div>
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="bg-ivory-dark border border-border hover:border-saffron/30 transition-all p-5 lg:p-6"
                >
                  <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                    <div className="lg:col-span-3">
                      <span className="font-deva text-xs text-saffron font-semibold block mb-1">{activity.sub}</span>
                      <h3 className="font-heading text-base lg:text-lg font-bold text-ink">{activity.title}</h3>
                    </div>
                    <div className="lg:col-span-6">
                      <p className="text-sm text-ink-soft leading-relaxed">{activity.desc}</p>
                    </div>
                    <div className="lg:col-span-3 flex flex-wrap gap-2">
                      {activity.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider border border-border px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20 text-center">
            <p className="font-deva text-saffron text-sm font-bold tracking-[0.2em] mb-2">॥ सेवा में संपर्क करें ॥</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">Need Help? We Are Here.</h2>
            <p className="text-sm text-white/45 max-w-xl mx-auto mb-8">
              Our sevadars are available 24×7 across the nation. Do not face any crisis alone — reach out to us.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/#helpline" className="px-6 py-3 bg-saffron text-white text-sm font-semibold rounded-sm hover:bg-saffron-deep transition-all uppercase tracking-wider">◈ Emergency Helpline</Link>
              <Link to="/#idcard" className="px-6 py-3 border border-saffron/30 text-saffron-light text-sm font-semibold rounded-sm hover:bg-saffron/10 transition-all uppercase tracking-wider">▣ Get ID Card</Link>
              <Link to="/#donate" className="px-6 py-3 border border-gold/20 text-gold-light text-sm font-semibold rounded-sm hover:bg-gold/10 transition-all uppercase tracking-wider">✦ Support the Cause</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
