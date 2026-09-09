# ResumeIQ — AI Resume Analyzer & Job Matcher

ResumeIQ is an AI-powered full-stack web application that helps job seekers analyze their resumes against specific job descriptions. It uses Google Gemini AI to evaluate resume-job compatibility, identify matching and missing skills, provide personalized resume improvement suggestions, and generate role-specific interview questions.

The application also includes an AI career chatbot that allows users to ask follow-up questions about their resume, target role, analysis results, skills, resume improvements, and interview preparation.

---

## 🚀 Features

- 📄 Upload resume in PDF format
- 📝 Paste a job description
- 🎯 Generate an AI-powered resume match score
- ✅ Identify skills matching the job description
- ❌ Identify missing or insufficiently demonstrated skills
- 💡 Get personalized and actionable resume improvement suggestions
- 🎤 Generate role-specific interview questions
- 🤖 Chat with an AI career assistant
- 📊 View structured resume analysis
- ⚠️ User-friendly error handling
- 🔐 Secure Gemini API key management using environment variables
- 🔄 Retry handling for temporary AI service errors
- 📱 Responsive and clean user interface

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Lucide React
- React Markdown

### Backend

- Python
- Flask
- Flask-CORS
- PyPDF2

### AI

- Google Gemini API
- Google GenAI Python SDK

### Development Tools

- Git
- GitHub
- npm
- Python Virtual Environment

---

## 🏗️ Project Architecture

```text
ai-resume-analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadCard.jsx
│   │   │   ├── JobDescription.jsx
│   │   │   ├── AnalysisResult.jsx
│   │   │   └── FeatureCard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── services/
│   │   ├── __init__.py
│   │   ├── pdf_service.py
│   │   └── ai_service.py
│   │
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md