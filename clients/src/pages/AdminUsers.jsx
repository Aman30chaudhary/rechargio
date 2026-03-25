import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, User, Mail, Calendar, Shield, MoreVertical, Filter, ArrowRight, UserPlus, Download, Trash2, Edit2, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, Input, Button } from '../components/UI';
import gsap from 'gsap';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    const ctx = gsap.context(() => {
      gsap.from('.admin-header', { y: -30, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.user-row', { x: -20, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.3, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="admin-header flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase italic">User <span className="text-primary">Management</span></h1>
            <p className="text-slate-500 font-bold text-lg">Detailed overview of all platform members and their status.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search users..." 
                className="w-full pl-14 pr-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-700 font-medium text-sm shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <UserPlus size={18} /> Add User
            </Button>
          </div>
        </div>

        {/* Users List Table-like Card */}
        <Card className="p-0 overflow-hidden border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Profile</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Wallet Assets</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={idx} className="user-row hover:bg-slate-50/50 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/5 text-xl">
                            {user.name ? user.name[0] : <User size={24} />}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-slate-700 text-lg leading-tight">{user.name || 'Guest User'}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {user.id?.toString().slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Mail size={14} className="text-primary" /> {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            <Calendar size={12} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-2xl font-black text-primary tracking-tighter">₹{user.walletBalance.toFixed(2)}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Available Funds</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          user.role === 'admin' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all border border-slate-100 shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-50 hover:bg-rose-50 transition-all border border-slate-100 shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <User size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">No members found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Today', value: '42 Members', icon: <UserCheck size={20} />, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Pending Verifications', value: '12 Users', icon: <ShieldCheck size={20} />, color: 'text-amber-600 bg-amber-50' },
            { label: 'Blocked Accounts', value: '0 Accounts', icon: <Trash2 size={20} />, color: 'text-rose-600 bg-rose-50' }
          ].map((item, i) => (
            <Card key={i} className="p-6 flex items-center gap-5 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${item.color} shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-black text-slate-800">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;
