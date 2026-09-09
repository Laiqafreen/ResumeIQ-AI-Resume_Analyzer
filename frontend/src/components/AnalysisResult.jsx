import { useState } from 'react'
import {
  Check,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User,
  Copy
} from 'lucide-react'

import ReactMarkdown from 'react-markdown'


export default function AnalysisResult({
  result,
  resumeText,
  jobDescription
}) {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  // NEW: Error notification state
  const [error, setError] = useState('')


  // =====================================
  // SEND CHAT MESSAGE
  // =====================================

  const sendMessage = async () => {

    if (!message.trim() || chatLoading) return

    const userMessage = message.trim()

    // Clear previous error
    setError('')


    // Show user's message immediately
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      }
    ])


    setMessage('')
    setChatLoading(true)


    try {

      const response = await fetch(
        'http://127.0.0.1:5000/api/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            analysis: result,
            message: userMessage
          })
        }
      )


      const data = await response.json()


      if (!response.ok) {

        throw new Error(
          data.error ||
          'Failed to get chatbot response.'
        )

      }


      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer
        }
      ])

    } catch (error) {

      // Show clean error notification
      setError(
        error.message ||
        'Something went wrong. Please try again.'
      )

    } finally {

      setChatLoading(false)

    }

  }


  // =====================================
  // COPY AI RESPONSE
  // =====================================

  const copyResponse = async (text, index) => {

    try {

      await navigator.clipboard.writeText(text)

      setCopiedIndex(index)


      setTimeout(() => {
        setCopiedIndex(null)
      }, 1500)

    } catch (error) {

      console.error(
        'Failed to copy response:',
        error
      )

    }

  }


  // =====================================
  // ENTER KEY
  // =====================================

  const handleKeyDown = (e) => {

    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault()

      sendMessage()

    }

  }


  // =====================================
  // CHAT SUGGESTION
  // =====================================

  const useSuggestion = (text) => {

    setMessage(text)

  }


  return (
    <>


      {/* =====================================
          RESUME ANALYSIS CARD
          ===================================== */}

      <div className="result-wrap">


        {/* HEADER */}

        <div className="result-head">

          <div>

            <span className="eyebrow small">

              <Sparkles size={13} />

              AI analysis

            </span>


            <h2>
              Your resume snapshot
            </h2>

          </div>


          {/* SCORE */}

          <div className="score">

            <strong>
              {result.score}%
            </strong>

            <span>
              match
            </span>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="summary">

          {result.summary}

        </div>


        {/* =====================================
            SKILLS GRID
            ===================================== */}

        <div className="result-grid">


          {/* MATCHING SKILLS */}

          <div className="result-section">

            <h4>

              <Check size={16} />

              Matching skills

            </h4>


            <div className="chips">

              {result.matchingSkills?.map(
                (skill, index) => (

                  <span
                    className="chip"
                    key={index}
                  >

                    {skill}

                  </span>

                )
              )}

            </div>

          </div>


          {/* MISSING SKILLS */}

          <div className="result-section">

            <h4>

              <AlertCircle size={16} />

              Skills to improve

            </h4>


            <div className="chips">

              {result.missingSkills?.map(
                (skill, index) => (

                  <span
                    className="chip muted"
                    key={index}
                  >

                    {skill}

                  </span>

                )
              )}

            </div>

          </div>

        </div>


        {/* =====================================
            SUGGESTIONS
            ===================================== */}

        <div className="result-section">

          <h4>

            <Lightbulb size={16} />

            Suggestions

          </h4>


          <ul className="suggestions">

            {result.suggestions?.map(
              (item, index) => (

                <li key={index}>

                  {item}

                </li>

              )
            )}

          </ul>

        </div>


        {/* =====================================
            INTERVIEW QUESTIONS
            ===================================== */}

        <div className="result-section interview">

          <h4>

            <MessageSquare size={16} />

            Interview questions

          </h4>


          <ol>

            {result.questions?.map(
              (item, index) => (

                <li key={index}>

                  {item}

                </li>

              )
            )}

          </ol>

        </div>

      </div>


      {/* =====================================
          CHATBOT CARD
          ===================================== */}

      <div className="chatbot-card">


        {/* =====================================
            CHAT HEADER
            ===================================== */}

        <div className="chatbot-header">

          <div className="chatbot-title">

            <div className="bot-icon">

              <Bot size={19} />

            </div>


            <div>

              <h3>
                ResumeIQ Assistant
              </h3>

              <span>
                Your personal career assistant
              </span>

            </div>

          </div>


          {/* AI STATUS */}

          <div className="chat-status">

            <span className="status-dot" />

            AI ready

          </div>

        </div>


        {/* =====================================
            ERROR NOTIFICATION
            ===================================== */}

        {error && (

          <div className="chat-error">

            <AlertCircle size={17} />

            <span>
              {error}
            </span>

            <button
              onClick={() => setError('')}
              aria-label="Close notification"
            >
              ×
            </button>

          </div>

        )}


        {/* =====================================
            CHAT MESSAGES
            ===================================== */}

        <div className="chat-messages">


          {/* =====================================
              WELCOME MESSAGE
              ===================================== */}

          {messages.length === 0 && (

            <div className="chat-welcome">

              <div className="welcome-bot">

                <Bot size={22} />

              </div>


              <h4>
                How can I help?
              </h4>


              <p>

                Ask me anything about your resume,
                this job, your skills, or interview
                preparation.

              </p>


              {/* SUGGESTIONS */}

              <div className="chat-suggestions">


                <button
                  onClick={() =>
                    useSuggestion(
                      'Why did I get this match score?'
                    )
                  }
                >

                  Why this match score?

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      'How can I improve my missing skills?'
                    )
                  }
                >

                  Improve my skills

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      'Give me an interview question for this job.'
                    )
                  }
                >

                  Practice interview

                </button>

              </div>

            </div>

          )}


          {/* =====================================
              CONVERSATION
              ===================================== */}

          {messages.map(
            (item, index) => (

              <div
                className={`chat-message ${item.role}`}
                key={index}
              >


                {/* AVATAR */}

                <div className="message-avatar">

                  {item.role === 'user'
                    ? <User size={15} />
                    : <Bot size={15} />
                  }

                </div>


                {/* MESSAGE CONTENT */}

                <div className="message-content">


                  {/* NAME */}

                  <span className="message-name">

                    {item.role === 'user'
                      ? 'You'
                      : 'ResumeIQ'
                    }

                  </span>


                  {/* MESSAGE BUBBLE */}

                  <div className="message-bubble">


                    {/* AI MESSAGE */}

                    {item.role === 'assistant' ? (

                      <>

                        <ReactMarkdown>

                          {item.text}

                        </ReactMarkdown>


                        {/* COPY BUTTON */}

                        <button
                          className="copy-response-btn"
                          onClick={() =>
                            copyResponse(
                              item.text,
                              index
                            )
                          }
                          title="Copy response"
                        >

                          <Copy size={12} />

                          {copiedIndex === index
                            ? 'Copied'
                            : 'Copy'
                          }

                        </button>

                      </>

                    ) : (

                      /* USER MESSAGE */

                      <p>

                        {item.text}

                      </p>

                    )}

                  </div>

                </div>

              </div>

            )
          )}


          {/* =====================================
              AI THINKING
              ===================================== */}

          {chatLoading && (

            <div className="chat-message assistant">

              <div className="message-avatar">

                <Bot size={15} />

              </div>


              <div className="message-content">

                <span className="message-name">

                  ResumeIQ

                </span>


                <div className="message-bubble thinking">

                  <span />
                  <span />
                  <span />

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =====================================
            CHAT INPUT
            ===================================== */}

        <div className="chat-input-area">


          <div className="chat-input">


            <input
              type="text"
              placeholder="Ask anything about your resume..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={chatLoading}
            />


            {/* SEND BUTTON */}

            <button
              onClick={sendMessage}
              disabled={
                !message.trim() ||
                chatLoading
              }
              aria-label="Send message"
            >

              <Send size={17} />

            </button>

          </div>


          <span className="chat-hint">

            Press Enter to send

          </span>

        </div>

      </div>

    </>
  )
}