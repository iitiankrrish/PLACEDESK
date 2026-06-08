# PLACEDESK

## Introduction and Vision

The management of campus placements and internships is a critical function within higher education institutions. However, the traditional workflow remains heavily dependent on manual, fragmented processes. The Placement Cell often faces administrative bottlenecks, including high-volume repetitive email drafting, inconsistent tracking of recruiter responses, and the arduous task of manual follow-ups. Simultaneously, students struggle with information asymmetry, often finding it difficult to access real-time, accurate data regarding visit schedules and eligibility criteria.

PlaceDesk was developed to modernize this infrastructure. The primary intent of this project is to create an intelligent, centralized hub that automates administrative communication and leverages large language models (LLMs) to transform unstructured email data into actionable institutional intelligence. By bridging the gap between recruiters, coordinators, and students, PlaceDesk ensures that no opportunity is lost to administrative delay.

---

## Key Features

### 1. AI-Driven Communication Engine
PlaceDesk features a professional email composition interface where administrators can provide a brief prompt or specific keywords. The system utilizes the Llama-3.3-70B model to generate highly professional, context-aware recruitment invitations. This eliminates the time spent on drafting and ensures institutional standard of communication.

### 2. Intelligent Sentiment Analysis and Categorization
The system monitors the institutional inbox via IMAP. As replies are received, they are automatically processed by an AI analysis layer.
- **Categorization:** Mails are classified as Positive (Interested/Confirmed), Negative (Declined), or Neutral (Inquiry).
- **Deep Extraction:** The system identifies and stores specific data points such as stipend amounts, CGPA cutoffs, required technical skills, and tentative visit dates.
- **Thread Tracking:** Utilizing unique message identifiers, the system links incoming replies to original outgoing threads, maintaining a clean history for every recruiter.

### 3. Automated Follow-up Management
To maximize recruiter engagement, the platform allows administrators to schedule automatic follow-ups. If a recruiter does not respond within a specified window, the system is designed to trigger reminders, ensuring the institution remains a priority for the hiring organization.

### 4. RAG-Powered Placement Chatbot
PlaceDesk implements Retrieval-Augmented Generation (RAG) to provide a factual query system for students. The chatbot accesses the verified database of analyzed HR replies to answer student questions regarding:
- Company visit dates.
- Specific skill requirements (e.g., "Which companies require Python?").
- Eligibility criteria and stipend details.
This ensures students receive information derived directly from recruiter correspondence, eliminating misinformation.

---

## Technical Architecture

### Frontend
- **Framework:** React.js with Vite
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useCallback, useRef, useEffect)
- **Client:** Axios for asynchronous API communication

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Cloud Atlas)
- **Messaging:** Brevo API (Transactional Email Dispatch)
- **Inbound Processing:** Imap-simple and Mailparser

### AI Service Layer (Python)
- **Engine:** Flask API
- **LLM Provider:** Groq Cloud (Llama-3.3-70B-Versatile)
- **NLP Framework:** LangChain (Prompt Engineering and RAG logic)
- **Environment:** Python 3.10+

---

## Local Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MongoDB account (Local or Atlas)
- Brevo API Key
- Groq API Key

### Repository Initialization
```bash
git clone https://github.com/iitiankrrish/SyntaxError.git
cd SyntaxError
```

### AI Service Setup
Navigate to the AI directory and install dependencies:
```bash
cd python/core_ai
pip install -r requirements.txt
python3 app.py
```

### Backend Setup
Install Node dependencies and initialize the server:
```bash
cd backend
npm install
npm start
```

### Frontend Setup
Install UI dependencies and launch the development environment:
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Configuration

To run this project, the following variables must be defined in your .env files:

### Backend (.env)
- **PORT:** 8000
- **MONGO_URI:** Your MongoDB connection string
- **JWT_SECRET:** Secure string for session management
- **BREVO_API_KEY:** Your xkeysib API key
- **EMAIL_USER:** Your verified sender email
- **IMAP_USER:** Gmail address for receiving
- **IMAP_PASS:** 16-character Gmail App Password
- **AI_SERVICE_URL:** http://localhost:10000

### Python (.env)
- **GROQ_API_KEY:** Your Groq Cloud access key
- **NODE_BACKEND_URL:** http://localhost:8000

---
### Demonstration Video 
[Google Drive Link](https://drive.google.com/file/d/1Lswjxkz1J7csa7HzqHOgLH1TUjAbOebm/view?usp=drive_link)
....
