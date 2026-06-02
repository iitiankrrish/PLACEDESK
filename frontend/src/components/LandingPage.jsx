import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <button onClick={() => navigate("/login/student")} className="w-64 h-64 bg-white border-2 border-blue-500 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4 hover:scale-105 transition active:scale-95">
          {/* <span className="text-5xl">🎓</span> */}
          <span className="text-xl font-black text-blue-600">STUDENT BOT</span>
        </button>
        <button onClick={() => navigate("/login/admin")} className="w-64 h-64 bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4 hover:scale-105 transition active:scale-95">
          {/* <span className="text-5xl">💼 </span> */}
          <span className="text-xl font-black text-white">ADMIN PANEL</span>
        </button>
      </div>
    </div>
  );
}