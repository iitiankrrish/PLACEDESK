import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import API_BASE_URL from "../config";
import { Send, Sparkles, ArrowLeft, Trash2, Clock } from "lucide-react";

export default function ComposeMail() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: "",
    subject: "",
    promptRequest: "", 
    mailBody: "",
    followUpDays: 0,
  });

  const handleGenerate = async () => {
    if (!formData.promptRequest) {
      return alert("Please enter a Prompt or Request so the AI knows what to write.");
    }

    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/mailer/generate-mail-content`, {
        purpose: formData.subject || "General Correspondence",
        keywords: formData.promptRequest,
      });

      setFormData(prev => ({
        ...prev,
        subject: res.data.subject || prev.subject,
        mailBody: res.data.body
      }));
    } catch (e) {
      alert("AI Service Error. Ensure Python server is running and API key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.recipientEmail || !formData.mailBody) {
      return alert("Recipient and Message Body are required.");
    }

    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/mailer/send-mail`, {
        recipientEmail: formData.recipientEmail,
        subject: formData.subject,
        body: formData.mailBody,
        followUpDays: formData.followUpDays,
      }, { withCredentials: true });

      alert("Email Sent Successfully!");
      navigate("/admin/mails");
    } catch (e) {
      alert("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/admin/mails")} 
            className="group flex items-center text-slate-500 hover:text-slate-800 font-semibold transition-all"
          >
            <div className="p-2 bg-white rounded-lg border border-slate-200 mr-3 group-hover:shadow-sm">
              <ArrowLeft size={18} />
            </div>
            Back to Mails
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-white border border-slate-300 px-5 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-all shadow-sm font-bold text-sm disabled:opacity-50"
            >
              {/* <Sparkles size={16} className={`text-indigo-500 ${isGenerating ? "animate-spin" : ""}`} /> */}
              <span>{isGenerating ? "AI is Drafting..." : "AI Auto-Write"}</span>
            </button>
            
            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200 font-bold text-sm disabled:opacity-50 active:scale-95"
            >
              <Send size={16} />
              <span>{isSending ? "Sending..." : "Send Mail"}</span>
            </button>
          </div>
        </div>

        {/* The Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Decorative Card Header */}
          <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">New Correspondence</h2>
            <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
          </div>

          <div className="p-10 space-y-8">
            {/* Recipient Section */}
            <div className="flex flex-col space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient Email</label>
              <input
                type="email"
                placeholder="hr@company.com"
                value={formData.recipientEmail}
                onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-medium placeholder:text-slate-300"
              />
            </div>

            {/* AI PROMPT AREA */}
            <div className="flex flex-col space-y-3 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
              <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest ml-1 flex items-center">
                AI PROMPT / SPECIAL REQUEST
              </label>
              <textarea
                rows="4"
                placeholder="Ex: Write a mail to HR of XYZ company about a 2025 SDE role. The tone should be polite. Emphasize a stipend."
                value={formData.promptRequest}
                onChange={e => setFormData({ ...formData, promptRequest: e.target.value })}
                className="w-full bg-transparent text-slate-700 italic outline-none transition-all text-[15px] leading-relaxed resize-none placeholder:text-slate-400"
              ></textarea>
            </div>

            {/* Subject Section */}
            <div className="flex flex-col space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject Line</label>
              <input
                type="text"
                placeholder="Compose a subject or let AI generate one..."
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-m font-bold placeholder:text-slate-300"
              />
            </div>

            {/* Message Body Section */}
            <div className="flex flex-col space-y-2">
              <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest ml-1">Message Content</label>
              <textarea
                rows="15"
                placeholder="The AI will fill this area, or you can write manually..."
                value={formData.mailBody}
                onChange={e => setFormData({ ...formData, mailBody: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[16px] leading-relaxed resize-none min-h-[450px] placeholder:text-slate-300"
              ></textarea>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="bg-slate-50/80 border-t border-slate-100 px-10 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-slate-600 space-x-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm">
                <Clock size={18} className="text-slate-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Follow-up:</span>
                <input
                  type="number"
                  value={formData.followUpDays}
                  onChange={e => setFormData({ ...formData, followUpDays: e.target.value })}
                  className="w-10 bg-transparent text-center font-black text-blue-600 outline-none border-b-2 border-blue-100"
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Days</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/admin/mails")}
              className="group flex items-center space-x-2 p-3 text-slate-400 hover:text-red-600 transition-all rounded-2xl hover:bg-red-50"
              title="Discard Draft"
            >
              <Trash2 size={22} />
              <span className="text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Discard</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}