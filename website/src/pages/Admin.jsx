import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, RefreshCw, LogOut } from 'lucide-react';

const API_URL = 'https://cx.cloudmiami.com/api/admin/leads';

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'cloud2026') { // Simple password
      setIsAuthenticated(true);
      localStorage.setItem('cm_admin_auth', 'true');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('cm_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cm_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-6">
        <div className="glass-card p-8 rounded-2xl w-full max-w-md text-center">
          <h2 className="text-2xl font-display font-bold mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
            <button type="submit" className="w-full py-3 bg-primary text-void font-bold rounded-lg hover:bg-white transition-all">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Lead Dashboard</h1>
            <p className="text-gray-400">View and manage captured leads</p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchLeads} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold text-gray-300">Name</th>
                  <th className="p-4 font-semibold text-gray-300">Email</th>
                  <th className="p-4 font-semibold text-gray-300">Interests</th>
                  <th className="p-4 font-semibold text-gray-300">Summary</th>
                  <th className="p-4 font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-primary">{lead.email}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {lead.interests?.map((tag, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm max-w-xs">{lead.notes || '-'}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(lead.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No leads found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}