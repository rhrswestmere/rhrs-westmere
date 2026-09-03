import { useState } from 'react'
import GalleryManager from './GalleryManager'
import RecordsView from './RecordsView'
import MembersView from './MembersView'
import HelplinesManager from './HelplinesManager'

export default function AdminDashboard({ token, onLogout }) {
  const [tab, setTab] = useState('gallery')

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur-md border-b border-saffron/15">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RHRS Logo" className="w-10 h-10 object-contain" draggable="false" />
            <div>
              <p className="font-heading text-xs font-bold text-white leading-tight">RHRS Admin</p>
              <p className="text-[10px] text-saffron-light/70 tracking-wider">Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-white/60 hover:text-saffron-light transition-colors uppercase tracking-wider">View Site</a>
            <button onClick={onLogout} className="px-4 py-2 text-xs font-bold text-white bg-saffron rounded-sm hover:bg-saffron-deep transition-colors uppercase tracking-wider cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="inline-flex bg-white border border-border rounded-sm p-1 gap-1 shadow-sm mb-8">
          <button onClick={() => setTab('gallery')} className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-sm ${tab === 'gallery' ? 'bg-saffron text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            ◈ Gallery
          </button>
          <button onClick={() => setTab('members')} className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-sm ${tab === 'members' ? 'bg-saffron text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            ◆ Members
          </button>
          <button onClick={() => setTab('records')} className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-sm ${tab === 'records' ? 'bg-saffron text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            ▣ Records
          </button>
          <button onClick={() => setTab('helplines')} className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-sm ${tab === 'helplines' ? 'bg-saffron text-white shadow-sm' : 'text-ink-muted hover:text-ink'}`}>
            ☎ Helplines
          </button>
        </div>

        {tab === 'gallery' && <GalleryManager token={token} />}
        {tab === 'members' && <MembersView token={token} />}
        {tab === 'records' && <RecordsView token={token} />}
        {tab === 'helplines' && <HelplinesManager token={token} />}
      </div>
    </div>
  )
}
