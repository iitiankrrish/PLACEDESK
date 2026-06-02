import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Place<span className="text-blue-600">Desk</span></h1>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-slate-500">Student Access</span>
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center space-x-1 text-slate-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-semibold">Exit</span>
          </button>
        </div>
      </nav>
    </header>
  );
}