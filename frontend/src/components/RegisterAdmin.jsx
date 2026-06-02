import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", enrollmentNo: "", password: "", picKey: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users/signup`, {
        username: formData.username,
        email: formData.email,
        enrollmentNumber: formData.enrollmentNo,
        password: formData.password,
        role: "pic_member",
        picKey: formData.picKey
      });
      alert("Admin Registered!");
      navigate("/login/admin");
    } catch (error) { alert("Registration failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-3">
        <h2 className="text-2xl font-black text-slate-800 text-center">Register Admin</h2>
        <input type="text" placeholder="Full Name" required className="w-full p-3 bg-slate-100 rounded-xl outline-none" onChange={e=>setFormData({...formData, username: e.target.value})}/>
        <input type="email" placeholder="Email" required className="w-full p-3 bg-slate-100 rounded-xl outline-none" onChange={e=>setFormData({...formData, email: e.target.value})}/>
        <input type="text" placeholder="Enrollment No" required className="w-full p-3 bg-slate-100 rounded-xl outline-none" onChange={e=>setFormData({...formData, enrollmentNo: e.target.value})}/>
        <input type="password" placeholder="Password" required className="w-full p-3 bg-slate-100 rounded-xl outline-none" onChange={e=>setFormData({...formData, password: e.target.value})}/>
        <input type="password" placeholder="PIC Secret Key" required className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl outline-none" onChange={e=>setFormData({...formData, picKey: e.target.value})}/>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Create Admin Account</button>
      </form>
    </div>
  );
}