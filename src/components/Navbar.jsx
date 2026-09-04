import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'ID Card', to: '/#idcard' },
  { label: 'Donate', to: '/#donate' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-20 bg-ink/95 backdrop-blur-md border-b border-saffron/15">
      <div className="h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
          <img
            src="/logo.png"
            alt="Rashtriya Hindu Rakshak Sangh (RHRS) Logo"
            className="h-14 w-14 lg:h-16 lg:w-16 object-contain drop-shadow-lg select-none"
            draggable="false"
          />
          <div className="leading-tight">
            <h1 className="font-heading text-sm lg:text-lg font-bold text-white leading-none">Rashtriya Hindu</h1>
            <p className="font-heading text-xs lg:text-sm text-saffron-light tracking-wide">Rakshak Sangh</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 text-xs font-medium text-white/60 hover:text-saffron-light transition-colors uppercase tracking-wider">{l.label}</Link>
          ))}
          <Link to="/#helpline" className="ml-2 px-4 py-2 text-xs font-bold text-white bg-saffron rounded-sm hover:bg-saffron-deep transition-colors uppercase tracking-wider flex items-center gap-1.5">
            ◈ Helpline
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col items-center justify-center w-11 h-11 gap-1.5"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`block w-5 h-[2px] bg-white rounded transition-all ${open ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded transition-all ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`lg:hidden bg-ink/98 border-t border-saffron/15 transition-all duration-300 ${open ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-4 py-3 text-sm text-white/60 hover:text-saffron-light rounded transition-colors">{l.label}</Link>
          ))}
          <Link to="/#helpline" onClick={() => setOpen(false)} className="mt-2 px-4 py-3 text-sm font-bold text-white bg-saffron text-center rounded-sm">◈ Helpline</Link>
        </div>
      </div>
    </nav>
  )
}
