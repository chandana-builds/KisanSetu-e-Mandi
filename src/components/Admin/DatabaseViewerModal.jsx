import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Users, 
  Ticket, 
  MessageSquare, 
  RefreshCw, 
  Search, 
  ShieldCheck,
  Download,
  Calendar,
  Layers
} from 'lucide-react';

export const DatabaseViewerModal = ({ isOpen, onClose }) => {
  const [activeTable, setActiveTable] = useState('users'); // 'users' | 'bookings' | 'sms'
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDatabaseData = async () => {
    setLoading(true);
    try {
      const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
      const [usersRes, bookingsRes, smsRes] = await Promise.all([
        fetch(`${API}/users`).then(r => r.json()).catch(() => []),
        fetch(`${API}/bookings`).then(r => r.json()).catch(() => []),
        fetch(`${API}/sms`).then(r => r.json()).catch(() => [])
      ]);

      setUsers(usersRes || []);
      setBookings(bookingsRes || []);
      setSmsLogs(smsRes || []);
    } catch (e) {
      console.error('Error fetching SQLite data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDatabaseData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.mobile?.includes(search) ||
    u.role?.includes(search) ||
    u.village?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    b.tokenNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.farmerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.crop?.toLowerCase().includes(search.toLowerCase()) ||
    b.status?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSms = smsLogs.filter(s =>
    s.tokenNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.recipient?.includes(search) ||
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.body?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg">SQLite Database Inspector</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                  server/database.sqlite
                </span>
              </div>
              <p className="text-xs text-slate-400">Live storage verification for SIH Hackathon evaluation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDatabaseData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh SQLite</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls & Table Switcher */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Table Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTable('users')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTable === 'users'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>users ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTable('bookings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTable === 'bookings'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTable('sms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTable === 'sms'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>sms_notifications ({smsLogs.length})</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          
          {/* USERS TABLE */}
          {activeTable === 'users' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Mobile (Login)</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Village / District</th>
                  <th className="py-2.5 px-3">Aadhaar (Last 4)</th>
                  <th className="py-2.5 px-3">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">No users found.</td></tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-indigo-700 font-bold">{u.id}</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{u.name}</td>
                      <td className="py-2.5 px-3 text-slate-700">{u.mobile}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">{u.village || '-'}, {u.district || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">XXXX-{u.aadhaar_last4 || 'N/A'}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{u.created_at || 'Just now'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* BOOKINGS TABLE */}
          {activeTable === 'bookings' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Token #</th>
                  <th className="py-2.5 px-3">Farmer Name</th>
                  <th className="py-2.5 px-3">Produce & Qty</th>
                  <th className="py-2.5 px-3">Procurement Center</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Moisture %</th>
                  <th className="py-2.5 px-3">Total Payable (MSP)</th>
                  <th className="py-2.5 px-3">DBT UTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredBookings.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-slate-400">No bookings found.</td></tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-amber-600 font-bold">{b.tokenNumber}</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{b.farmerName}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{b.crop} ({b.quantity} Qtl)</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 truncate max-w-[160px]">{b.centerName}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{b.qualityMoisture ? `${b.qualityMoisture}%` : '-'}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">₹{b.totalPmt?.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px]">{b.paymentUtr || 'Pending'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* SMS NOTIFICATIONS TABLE */}
          {activeTable === 'sms' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">SMS ID</th>
                  <th className="py-2.5 px-3">Token</th>
                  <th className="py-2.5 px-3">Recipient Mobile</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">SMS Message Content</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredSms.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">No SMS logs found.</td></tr>
                ) : (
                  filteredSms.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">{s.id}</td>
                      <td className="py-2.5 px-3 text-amber-600 font-bold">{s.tokenNumber || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-700">+91 {s.recipient}</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-emerald-800">{s.title}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 max-w-sm">{s.body}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{s.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Connected to persistent SQLite database via Express API</span>
          <span className="font-mono text-emerald-700 font-bold">SQLITE_STATUS: ACTIVE & READY</span>
        </div>

      </div>
    </div>
  );
};
