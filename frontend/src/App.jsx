import { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react'

import Header from './components/Header'
import UploadCard from './components/UploadCard'
import JobDescription from './components/JobDescription'
import AnalysisResult from './components/AnalysisResult'
import FeatureCard from './components/FeatureCard'


function App() {
  const [resume, setResume] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const analyze = async () => {
    if (!resume || !jobDescription.trim()) return

    setLoading(true)
    setError('')
    setResult(null)
    setResumeText('')

    try {
      const formData = new FormData()

      formData.append('resume', resume)
      formData.append(
        'job_description',
        jobDescription
      )


      const response = await fetch(
        'http://127.0.0.1:5000/api/analyze',
        {
          method: 'POST',
          body: formData
        }
      )


      const data = await response.json()


      if (!response.ok) {
        throw new Error(
          data.error ||
          'Failed to analyze resume.'
        )
      }


      // Save Gemini analysis
      setResult(data)

      // Save extracted resume text
      setResumeText(
        data.resume_text || ''
      )

    } catch (err) {
      console.error(err)

      setError(
        err.message ||
        'Something went wrong. Make sure the backend is running.'
      )

    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="app-shell">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />


      <Header />


      <main>

        {/* HERO */}

        <section className="hero">

          <div className="eyebrow">
            <Sparkles size={15} />
            Beginner-friendly AI project
          </div>


          <h1>
            Turn your resume into your{' '}
            <span>career advantage.</span>
          </h1>


          <p>
            Upload your resume, paste a job description,
            and get clear AI-powered feedback on skills,
            gaps, keywords, and interview preparation.
          </p>

        </section>



        {/* WORKSPACE */}

        <section className="workspace">

          {/* LEFT SIDE */}

          <div className="input-column">

            <UploadCard
              resume={resume}
              setResume={setResume}
            />


            <JobDescription
              value={jobDescription}
              setValue={setJobDescription}
            />


            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={
                !resume ||
                !jobDescription.trim() ||
                loading
              }
            >

              {loading
                ? 'Analyzing your resume…'
                : 'Analyze my resume'
              }


              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </div>



          {/* RIGHT SIDE */}

          <div className="result-column">

            {result ? (

              <AnalysisResult
                result={result}
                resumeText={resumeText}
                jobDescription={jobDescription}
              />

            ) : (

              <div className="empty-result">

                <div className="empty-icon">
                  <Target size={28} />
                </div>


                <h2>
                  Your analysis will appear here
                </h2>


                <p>
                  Upload a PDF resume and paste
                  the job description to start.
                </p>


                <div className="mini-points">

                  <span>
                    <ShieldCheck size={16} />
                    Clear skill gaps
                  </span>


                  <span>
                    <Zap size={16} />
                    AI suggestions
                  </span>

                </div>

              </div>

            )}

          </div>

        </section>



        {/* FEATURES */}

        <section className="features">

          <FeatureCard
            icon={<Target />}
            title="Match score"
            text="See how closely your resume fits the target role."
          />


          <FeatureCard
            icon={<Sparkles />}
            title="AI feedback"
            text="Get beginner-friendly suggestions you can act on."
          />


          <FeatureCard
            icon={<ShieldCheck />}
            title="Interview prep"
            text="Generate questions based on your target job."
          />

        </section>

      </main>



      <footer>
        ResumeIQ • Built as a beginner AI portfolio project
      </footer>

    </div>
  )
}


export default App