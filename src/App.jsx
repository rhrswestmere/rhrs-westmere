import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Helpline from './components/Helpline'
import IdCard from './components/IdCard'
import Donate from './components/Donate'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
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
