import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; 
import API_BASE_URL from "../config";
import { 
  Plus, 
  Inbox, 
  Send, 
  Star, 
  RefreshCw, 
  X, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  ShieldCheck,
  FileText,
  Mail as MailIcon 
} from "lucide-react";

export default function Mails() {
  const [inboxMails, setInboxMails] = useState([]);
  const [sentMails, setSentMails] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [filterTone, setFilterTone] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showFullHistory, setShowHistory] = useState(false);
  
  const hasInitialSync = useRef(false);

  const fetchMails = useCallback(async (deep = false) => {
    setLoading(true);
    try {
      // 1. Trigger the sync on backend
      await axios.post(`${API_BASE_URL}/api/mailer/fetch-emails`, { deepSync: deep }, { withCredentials: true });
      
      // 2. Get the updated lists
      const resIn = await axios.get(`${API_BASE_URL}/api/mailer/getReceivedMails`, { withCredentials: true });
      setInboxMails(resIn.data.data || []);
      
      const resOut = await axios.get(`${API_BASE_URL}/api/mailer/getSentMails`, { withCredentials: true });
      setSentMails(resOut.data || []);
    } catch (e) { 
        console.error("Sync failed", e); 
    } finally { 
        setLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (!hasInitialSync.current) {
        fetchMails(false); 
        hasInitialSync.current = true;
    }
  }, [fetchMails]);

  const displayedMails = (activeTab === 'inbox' ? inboxMails : sentMails).filter(m => {
    if (activeTab === 'sent' || filterTone === "All") return true;
    return m.tone === filterTone;
  });

  const MailCard = ({ mail }) => (
    <div 
        onClick={() => { setSelectedMail(mail); setShowHistory(false); }} 
        className="bg-white p-5 border-b border-slate-100 hover:bg-blue-50/50 transition-all cursor-pointer flex justify-between items-center group"
    >
      <div className="flex-1 truncate pr-8">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-bold text-slate-800 text-sm">{activeTab === 'inbox' ? mail.from : `To: ${mail.recipientEmail}`}</p>
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(mail.sentAt || mail.date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-blue-600 font-bold text-xs truncate mb-1 uppercase tracking-tight">{mail.subject}</p>
        <p className="text-slate-500 text-xs truncate italic">
            "{mail.summary || (mail.body ? mail.body.substring(0, 60) + "..." : "No content")}"
        </p>
      </div>

      {activeTab === 'inbox' && (
        <div className="flex flex-col items-end space-y-1.5">
          <div className="flex text-yellow-400">
            {[...Array(mail.rating || 1)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
            mail.tone === 'Positive' ? 'bg-green-100 text-green-700' : 
            mail.tone === 'Negative' ? 'bg-red-100 text-red-700' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {mail.tone}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminNavbar />
      
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Place<span className="text-blue-600">Desk</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Placement Intelligence System</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeTab === 'inbox' && (
                <select 
                  value={filterTone} 
                  onChange={(e) => setFilterTone(e.target.value)}
                  className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none shadow-sm focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="All">All Replies</option>
                  <option value="Positive">Interested Only</option>
                  <option value="Negative">Declined Only</option>
                  <option value="Neutral">Neutral Only</option>
                </select>
            )}
            
            <button 
                title="Deep Sync (Last 7 Days)" 
                onClick={() => fetchMails(true)} 
                className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm active:scale-95"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <Link to="/admin/mails/composemail" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center space-x-2">
                <Plus size={18}/>
                <span>Compose</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-200">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => setActiveTab("inbox")} className={`flex-1 py-5 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'inbox' ? "text-blue-600 border-b-2 border-blue-600 bg-white" : "text-slate-400 hover:text-slate-600"}`}>
                <div className="flex items-center justify-center space-x-2">
                    <Inbox size={16}/> <span>Inbox</span>
                </div>
            </button>
            <button onClick={() => setActiveTab("sent")} className={`flex-1 py-5 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'sent' ? "text-blue-600 border-b-2 border-blue-600 bg-white" : "text-slate-400 hover:text-slate-600"}`}>
                <div className="flex items-center justify-center space-x-2">
                    <Send size={16}/> <span>Sent Items</span>
                </div>
            </button>
          </div>

          <div className="min-h-[600px] divide-y divide-slate-50">
            {loading && displayedMails.length === 0 ? (
                <div className="p-40 text-center flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-sm font-medium">Syncing with Gmail...</p>
                </div>
            ) : (
                displayedMails.length > 0 ? (
                    displayedMails.map(m => <MailCard key={m._id} mail={m} />)
                ) : (
                    <div className="p-40 text-center flex flex-col items-center">
                        <MailIcon size={48} className="text-slate-100 mb-4" />
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">No messages found</p>
                    </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* --- PROFESSIONAL PREVIEW MODAL --- */}
      {selectedMail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-150">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="truncate pr-8">
                    <h2 className="font-black text-slate-800 truncate text-lg">{selectedMail.subject}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
                            {(selectedMail.from || "U").charAt(0)}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {selectedMail.from || selectedMail.recipientEmail}
                        </p>
                    </div>
                </div>
                <button onClick={() => setSelectedMail(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition">
                    <X size={20}/>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'inbox' && (
                    <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={80} className="text-blue-600" />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center">
                                <FileText size={12} className="mr-2"/> AI Intelligence Report
                            </span>
                            <span className={`text-[9px] px-3 py-1 rounded-full font-black text-white ${
                                selectedMail.tone === 'Positive' ? 'bg-green-500' : 
                                selectedMail.tone === 'Negative' ? 'bg-red-500' : 
                                'bg-slate-500'
                            }`}>
                                {selectedMail.tone}
                            </span>
                        </div>
                        <p className="text-blue-900 font-bold text-sm mb-6 leading-relaxed italic">
                            "{selectedMail.summary}"
                        </p>
                        
                        <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-[11px] relative z-10 border-t border-blue-100 pt-5">
                            <div><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">Company</span> <b className="text-slate-700">{selectedMail.internship_info?.company_name || 'N/A'}</b></div>
                            <div><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">Position</span> <b className="text-slate-700">{selectedMail.internship_info?.position || 'N/A'}</b></div>
                            <div><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">CGPA Cutoff</span> <b className="text-blue-700">{selectedMail.internship_info?.minimum_cgpa || 'N/A'}</b></div>
                            <div><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">Stipend</span> <b className="text-blue-700">{selectedMail.internship_info?.stipend || 'N/A'}</b></div>
                            <div className="col-span-2"><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">Required Skills</span> <b className="text-slate-700 leading-normal">{selectedMail.internship_info?.skills_required || 'N/A'}</b></div>
                            <div><span className="text-slate-400 uppercase font-black block text-[8px] tracking-widest mb-1">Visit Date</span> <b className="text-slate-700">{selectedMail.internship_info?.visit_date || 'TBD'}</b></div>
                        </div>
                    </div>
                )}

                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {selectedMail.body.split(/On.*wrote:/i)[0]}
                </div>

                {selectedMail.body.includes("On") && (
                    <div className="mt-10 border-t border-slate-100 pt-6">
                        <button onClick={() => setShowHistory(!showFullHistory)} className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-800 transition">
                            {showFullHistory ? <ChevronUp size={14} className="mr-1"/> : <ChevronDown size={14} className="mr-1"/>}
                            {showFullHistory ? "Hide History" : "View Original Thread"}
                        </button>
                        {showFullHistory && (
                            <div className="mt-4 p-5 bg-slate-50 rounded-2xl text-slate-400 text-xs italic leading-loose border-l-4 border-slate-200">
                                {selectedMail.body.split(/On.*wrote:/i)[1]}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                    onClick={() => setSelectedMail(null)} 
                    className="px-10 py-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition shadow-sm text-xs uppercase tracking-widest active:scale-95"
                >
                    Close Preview
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}