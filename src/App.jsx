import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Helpline from './components/Helpline'
import IdCard from './components/IdCard'
import Donate from './components/Donate'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    document.title = 'Rashtriya Hindu Rakshak Sangh (RHRS) — Heritage, Service & Unity'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Rashtriya Hindu Rakshak Sangh (RHRS) is a nationwide organization dedicated to the preservation of Hindu cultural heritage, social welfare, legal protection, and national service across India.')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', 'https://rhrs.co.in/')

    import('gsap').then(({ default: gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.refresh()
      })
    ).catch(() => {})
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Helpline />
        <IdCard />
        <Donate />
      </main>
      <Footer />
    </>
  )
}
