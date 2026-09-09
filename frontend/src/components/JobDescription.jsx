import { Briefcase, ClipboardPaste } from 'lucide-react'

export default function JobDescription({ value, setValue }) {
  const sample = `We are looking for an Associate Software Engineer.

Requirements:
• Basic Java or JavaScript knowledge
• SQL and database fundamentals
• REST API understanding
• Good problem-solving skills
• Familiarity with Git and software development lifecycle`

  return (
    <div className="card">
      <div className="card-title">
        <div><span className="step">02</span><h3>Paste job description</h3></div>
        <Briefcase size={19} />
      </div>
      <textarea value={value} onChange={e => setValue(e.target.value)}
        placeholder="Paste the job description here..." rows="9" />
      <button className="sample-btn" onClick={() => setValue(sample)}>
        <ClipboardPaste size={15} /> Use sample job description
      </button>
    </div>
  )
}