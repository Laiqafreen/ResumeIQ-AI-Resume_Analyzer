import json
import os
import time

from dotenv import load_dotenv
from google import genai


load_dotenv()


MODEL_NAME = "gemini-3.6-flash"


def get_client():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. Add it to backend/.env."
        )

    return genai.Client(api_key=api_key)


def generate_with_retry(client, prompt, max_retries=2):
    """
    Calls Gemini and retries temporary 503 errors
    using a small exponential backoff.
    """

    for attempt in range(max_retries + 1):
        try:
            return client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

        except Exception as exc:
            error_message = str(exc)

            # Retry only temporary service-unavailable errors
            if "503" not in error_message and "UNAVAILABLE" not in error_message:
                raise

            # Stop after the final attempt
            if attempt == max_retries:
                raise

            # 1 second, then 2 seconds
            wait_time = 2 ** attempt

            print(
                f"Gemini temporarily unavailable. "
                f"Retrying in {wait_time} second(s)..."
            )

            time.sleep(wait_time)


def analyze_resume(resume_text, job_description):

    client = get_client()

    prompt = f"""
Analyze this resume against this job description.

Return ONLY valid JSON.
Do not add markdown, explanations, or code blocks.

The JSON must contain exactly these fields:
{{
    "score": integer from 0 to 100,
    "summary": "short string",
    "matchingSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "suggestions": ["suggestion1", "suggestion2"],
    "questions": ["question1", "question2"]
}}

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    response = generate_with_retry(
        client,
        prompt
    )

    raw = response.text.strip()

    # Remove markdown code fences if Gemini accidentally adds them
    if raw.startswith("```"):
        raw = raw.replace("```json", "")
        raw = raw.replace("```", "")
        raw = raw.strip()

    return json.loads(raw)


def chat_with_resume(
    resume_text,
    job_description,
    analysis,
    message
):

    client = get_client()

    analysis_text = json.dumps(
        analysis,
        indent=2
    )

    prompt = f"""
You are an AI career assistant inside a Resume Analyzer application.

The user has uploaded a resume and provided a job description.

Use the resume, job description, and previous analysis below
to answer the user's question accurately.

Be helpful, clear, and beginner-friendly.

Do not invent information that is not present in the resume
or job description.

If the user asks for advice, give practical and actionable advice.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

PREVIOUS ANALYSIS:
{analysis_text}

USER QUESTION:
{message}

Answer the user's question directly.
"""

    response = generate_with_retry(
        client,
        prompt
    )

    return response.text.strip()