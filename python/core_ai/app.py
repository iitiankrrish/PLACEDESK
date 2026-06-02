import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

basedir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)
CORS(app)

GROQ_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_KEY)
NODE_CONTEXT_URL = "http://localhost:8000/api/mailer/chat-context"

def get_all_context_as_text():
    try:
        res = requests.get(NODE_CONTEXT_URL, timeout=5)
        if res.status_code != 200: return "No placement data available."
        mails = res.json()
        if not mails: return "No placement data available."
        kb = "VERIFIED PLACEMENT DATABASE:\n"
        for m in mails:
            i = m.get('internship_info', {})
            kb += f"\n- COMPANY: {i.get('company_name')}\n"
            kb += f"  Status: {m.get('tone')} | Rating: {m.get('rating')}/5\n"
            kb += f"  Role: {i.get('position')}\n"
            kb += f"  Criteria: CGPA {i.get('minimum_cgpa')}, Branches: {i.get('eligible_branches')}\n"
            kb += f"  Skills: {i.get('skills_required')}\n"
            kb += f"  Stipend: {i.get('stipend')}\n"
            kb += f"  Visit Date: {i.get('visit_date')}\n"
            kb += f"  Summary: {m.get('important_summary')}\n"
            kb += "-----------------------"
        return kb
    except:
        return "Error loading database."

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        context = get_all_context_as_text()
        
        system_prompt = """You are the official IITR Placement Assistant. 
        Only answer based on the VERIFIED PLACEMENT DATABASE provided. 
        If a company isn't in the database, explicitly state that no information is available for them yet. 
        Be extremely precise about CGPA, Stipends, and Dates."""

        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{context}\n\nQuestion: {data.get('question')}"}
            ],
            temperature=0 
        )
        return jsonify({"answer": completion.choices[0].message.content})
    except Exception as e:
        return jsonify({"answer": "I'm having trouble accessing the records right now."}), 500

@app.route('/analyze-email', methods=['POST'])
def analyze():
    try:
        emails = request.json.get('emails', [])
        results = []
        for text in emails:
            prompt = f"""
            TASK: Exhaustive analysis of HR/Company reply.
            OBJECTIVE: Extract every detail. Analyze ONLY the new reply, ignore history.
            
            SCORING:
            - Tone: "Positive" (Interest/Confirm), "Negative" (Decline/Reject), "Neutral" (Queries only).
            - Rating: 1 (Rejection) to 5 (Confirmed Visit).
            
            EXTRACTION:
            - Extract Name, Role, Stipend, PPO details.
            - Eligibility: Min CGPA (number), Eligible Branches, Backlog criteria.
            - Skills: List ALL technologies (Languages, Frameworks, Cloud, tools).
            - Process: PPT, Test, Interview rounds.
            - Visit: Dates, duration, joining month.
            
            Return JSON:
            {{
                "tone": "Positive" | "Negative" | "Neutral",
                "rating": 1-5,
                "is_relevant": true,
                "summary": "1-sentence decision summary",
                "important_summary": "Detailed paragraph of ALL facts found.",
                "internship_info": {{
                    "company_name": "...", "position": "...", "stipend": "...",
                    "eligible_branches": "...", "minimum_cgpa": "...",
                    "skills_required": "Detailed list", "visit_date": "...",
                    "selection_process": "...", "additional_notes": "..."
                }}
            }}
            EMAIL: {text}
            """
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            results.append(json.loads(completion.choices[0].message.content))
        return jsonify({"analyses": results})
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/generate-email', methods=['POST'])
def generate():
    try:
        data = request.json
        prompt = f"KEYWORDS/PROMPT: {data.get('keywords')}\nPURPOSE: {data.get('purpose')}\n\nWrite a custom email. Subject line followed by '---' then the body."
        res = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        full = res.choices[0].message.content
        if "---" in full:
            s, b = full.split("---", 1)
            return jsonify({"subject": s.replace("Subject:", "").strip(), "body": b.strip()})
        return jsonify({"subject": "Placement Inquiry", "body": full})
    except Exception as e: return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=10000)