from flask import Flask, request, jsonify
from flask_cors import CORS

from services.pdf_service import extract_text_from_pdf
from services.ai_service import analyze_resume, chat_with_resume


app = Flask(__name__)

CORS(app)


# =====================================
# HEALTH CHECK
# =====================================

@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "ResumeIQ backend is running"
    })


# =====================================
# RESUME ANALYSIS
# =====================================

@app.post("/api/analyze")
def analyze():

    if "resume" not in request.files:
        return jsonify({
            "error": "Please upload a PDF resume."
        }), 400


    job_description = request.form.get(
        "job_description",
        ""
    ).strip()


    if not job_description:
        return jsonify({
            "error": "Please provide a job description."
        }), 400


    resume_file = request.files["resume"]


    if not resume_file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Only PDF resumes are supported."
        }), 400


    try:

        resume_text = extract_text_from_pdf(
            resume_file
        )


        analysis = analyze_resume(
            resume_text,
            job_description
        )


        return jsonify({
            **analysis,
            "resume_text": resume_text
        })


    except Exception as exc:

        error_message = str(exc)


        # Gemini quota error
        if (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            return jsonify({
                "error": "AI usage limit reached. Please try again later."
            }), 429


        return jsonify({
            "error": "Something went wrong while analyzing the resume."
        }), 500


# =====================================
# CHATBOT
# =====================================

@app.post("/api/chat")
def chat():

    data = request.get_json()


    if not data:
        return jsonify({
            "error": "Request data is missing."
        }), 400


    resume_text = data.get(
        "resume_text",
        ""
    ).strip()


    job_description = data.get(
        "job_description",
        ""
    ).strip()


    analysis = data.get(
        "analysis",
        {}
    )


    message = data.get(
        "message",
        ""
    ).strip()


    if not resume_text:
        return jsonify({
            "error": "Resume context is missing."
        }), 400


    if not job_description:
        return jsonify({
            "error": "Job description is missing."
        }), 400


    if not message:
        return jsonify({
            "error": "Please enter a message."
        }), 400


    try:

        answer = chat_with_resume(
            resume_text,
            job_description,
            analysis,
            message
        )


        return jsonify({
            "answer": answer
        })


    except Exception as exc:

        error_message = str(exc)


        # Gemini quota error
        if (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            return jsonify({
                "error": "AI usage limit reached. Please try again later."
            }), 429


        return jsonify({
            "error": "Something went wrong while contacting the AI."
        }), 500


# =====================================
# START FLASK SERVER
# =====================================

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )