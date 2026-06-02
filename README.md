# 💼 PLACEDESK

## 🧩 Problem It Solves

The placement process in most colleges is still **manual, time-consuming, and unorganized**.  
The **Placement and Internship Cell (PIC)** members have to:

- Draft and send **individual emails** to company HRs, inviting them for recruitment drives.  
- Keep track of **which companies replied**, **who showed interest**, and **who didn’t respond**.  
- Send **follow-up emails** manually to companies that haven’t replied.  
- Communicate placement updates to students through **multiple channels** (WhatsApp, mail, notices, etc.), often leading to missed information and confusion.

On the other hand, **students** face difficulties accessing authentic, up-to-date information about:

- Upcoming company visits  
- Eligibility criteria  
- Internship and placement opportunities  
- Application deadlines  

All this results in:

- ❌ Inefficient communication between the **PIC** and **students**  
- ⏰ Delayed or missed opportunities due to lack of timely updates  
- 🔁 Repetitive manual work for **PIC members**

---

## 💡 PlaceDesk Solves These Problems By

- 🤖 **Automating HR communication** — The system sends placement invitation mails to companies automatically and organizes incoming responses.  
- 🧠 **AI-powered email classification** — It classifies replies from HRs as **Positive**, **Negative**, or **Neutral**, saving time and effort.  
- 🔔 **Follow-up reminders** — Automatically reminds HRs who haven’t responded, ensuring no potential recruiter is missed.  
- 📊 **Centralized information system** — Both PIC members and students access all placement-related data in one place.  
- 💬 **Chatbot for students** — Provides students with instant answers about companies, eligibility, and placement details through an AI chatbot interface.  

---

### 🎯 In Essence

> **PlaceDesk eliminates manual workload, enhances communication, and brings intelligence and automation to college placement management.**

## 🧠 Tech Stack

### **Frontend / UI**
- React  
- React DOM  
- React Router DOM  
- TailwindCSS  
- Vite  
- Axios (for API requests)  
- Lucide React (icons)

### **Backend**
- Node.js  
- Express.js  
- MongoDB (database)  
- Gmail API / SMTP / IMAP (for sending, receiving, and classifying HR mails)

### **AI / Automation**
- **Llama-3.3-70B-Versatile** via **Groq API** (email generation, sentiment analysis, summary generation)  
- **LangChain** (RAG implementation for chatbot)  
- **Cohere API** (chatbot responses and NLP tasks)  
- **Python Libraries / Frameworks**:
  - Flask & flask-cors (backend API for AI services)  
  - PyTorch (model execution)  
  - Transformers (language models)  
  - Sentence-Transformers (embeddings)  
  - FAISS (vector search for RAG)  
  - HuggingFace Hub (model storage & retrieval)  
  - Python-dotenv (environment variable management)

### **TypeScript / Types**
- @types/react  
- @types/react-dom  

### **Linting / Code Quality**
- ESLint  
- eslint-plugin-react-hooks  
- eslint-plugin-react-refresh  

### **Deployment**
- Frontend: Vercel  
- Backend & Python services: Render / Railway / AWS  

### **Version Control**
- Git & GitHub

  ## ⚙️ Local Setup (Quick Start)

Set up and run **PlaceDesk** locally in just a few steps 👇  

### 🧩 Prerequisites
Make sure your system has:
- **Python (>=3.9)**  
- **Node.js & npm**

---

### Clone the Repository
```bash
git clone https://github.com/iitiankrrish/SyntaxError.git
cd SyntaxError
```
### Install Python Dependencies
Navigate to the AI folder and install all required packages:
```bash
pip install -r ./core_ai/requirements.txt
```
### Install JavaScript Dependencies
Install dependencies for both backend and frontend:
### For backend
```bash
  cd backend
  npm install
```

### For frontend

```bash
cd ../frontend
npm install
```
## Run in terminal

### Start the backend:
```bash
cd backend
npm start
```

### Start the frontend (in a new terminal):
```bash 
cd frontend
npm run dev
```

### Run the AI service (in a new terminal):
```bash
cd core_ai
python app.py
```

### Run the Segregator AI service (in a new terminal):
```bash
cd core_ai
python emailSegregation.py
```

### Access the App
[Frontend](http://localhost:5173)  
[Backend](http://localhost:8000)
