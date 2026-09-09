import { FileText, Circle } from 'lucide-react'

export default function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><FileText size={19} /></div>
        <div><strong>ResumeIQ</strong><span>AI Resume Analyzer</span></div>
      </div>
      <div className="status"><Circle size={8} fill="currentColor" /> AI workspace</div>
    </header>
  )
}