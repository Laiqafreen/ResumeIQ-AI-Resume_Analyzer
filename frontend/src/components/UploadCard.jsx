import { Upload, FileText, X } from 'lucide-react'

export default function UploadCard({ resume, setResume }) {
  const onChange = (event) => {
    const file = event.target.files?.[0]
    if (file) setResume(file)
  }

  return (
    <div className="card">
      <div className="card-title">
        <div><span className="step">01</span><h3>Upload your resume</h3></div>
        <span className="format">PDF</span>
      </div>
      {!resume ? (
        <label className="dropzone">
          <input type="file" accept=".pdf" onChange={onChange} />
          <div className="upload-icon"><Upload size={22} /></div>
          <strong>Drop your PDF here</strong>
          <span>or click to browse • Max 5 MB</span>
        </label>
      ) : (
        <div className="file-selected">
          <div className="file-icon"><FileText size={21} /></div>
          <div className="file-info"><strong>{resume.name}</strong>
            <span>{(resume.size / 1024 / 1024).toFixed(2)} MB</span></div>
          <button onClick={() => setResume(null)} aria-label="Remove resume"><X size={18} /></button>
        </div>
      )}
    </div>
  )
}