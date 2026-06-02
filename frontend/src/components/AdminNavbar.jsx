import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, MessageSquare, LogOut, Layout } from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Mail Center", icon: Mail, path: "/admin/mails" },
    { name: "Ask Placement Bot", icon: MessageSquare, path: "/admin/chat" },
  ];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/admin/mails")}>
            <Layout className="text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">Admin<span className="text-blue-400">Portal</span></h1>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path ? "text-blue-400" : "text-slate-300 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            ))}
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 border-l border-slate-700 pl-6 ml-2"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}