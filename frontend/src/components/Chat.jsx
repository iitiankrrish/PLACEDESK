import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../config";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    const userMessage = { id: Date.now(), text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/send`,
        { question: inputValue },
        { withCredentials: true }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || "No information found regarding this.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "Error connecting to AI service.",
        sender: "bot",
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {location.pathname.startsWith("/student") ? <Navbar /> : <AdminNavbar />}

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 mt-4">
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white flex items-center space-x-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
             <div>
               <h2 className="font-bold">IITR Placement Support</h2>
               <p className="text-xs text-blue-100">RAG-powered Intelligence</p>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.length === 0 && (
              <p className="text-center text-slate-400 mt-20">Ask anything about company visits, stipends, or criteria.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  m.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-800"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-slate-400 animate-pulse">Bot is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about placement data..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}