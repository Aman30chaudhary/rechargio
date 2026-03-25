import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Smartphone, Clock, CheckCircle2, XCircle, Search, TrendingUp, TrendingDown, 
  Filter, Calendar, Mail, Download, ArrowRight, DollarSign, Activity, List,
  Globe, Phone, Tv, Zap, Flame, Droplets
} from 'lucide-react';
import { Card, Input, Button } from '../components/UI';
import gsap from 'gsap';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const serviceIcons = {
    'Mobile': <Smartphone size={14} className="text-primary" />,
    'Card': <CreditCard size={14} className="text-primary" />,
    'Broadband': <Globe size={14} className="text-primary" />,
    'Landline': <Phone size={14} className="text-primary" />,
    'CableTv': <Tv size={14} className="text-primary" />,
    'Electricity': <Zap size={14} className="text-primary" />,
    'Gas': <Flame size={14} className="text-primary" />,
    'Water': <Droplets size={14} className="text-primary" />,
  };

  useEffect(() => {
    fetchTransactions();
    const ctx = gsap.context(() => {
      gsap.from('.admin-header', { y: -30, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.tx-row', { x: -20, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.3, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/transactions?status=${filter === 'all' ? '' : filter}`);
      setTransactions(response.data);
      
      // Attempt to fetch stats if available
      try {
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(statsRes.data);
      } catch (e) {
        console.error('Stats fetch failed');
      }
    } catch (err) {
      console.error('Failed to fetch transactions');
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    (tx.mobileNumber || '').includes(search) || 
    (tx.userId?.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (tx.paymentId?.includes(search)) ||
    (tx.serviceType?.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success': return { 
        style: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
        icon: <CheckCircle2 size={12} />,
        label: 'Success'
      };
      case 'failed': return { 
        style: 'bg-rose-50 text-rose-600 border-rose-100', 
        icon: <XCircle size={12} />,
        label: 'Failed'
      };
      default: return { 
        style: 'bg-amber-50 text-amber-600 border-amber-100', 
        icon: <Clock size={12} />,
        label: 'Pending'
      };
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="admin-header flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Activity <span className="text-primary">Logs</span></h1>
            <p className="text-slate-500 font-bold text-lg">Real-time audit trails of all platform transactions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search TxID, number or email..." 
                className="w-full pl-14 pr-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-700 font-medium text-sm shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto no-scrollbar shadow-sm">
              {['all', 'success', 'pending', 'failed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    filter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List Card */}
        <Card className="p-0 overflow-hidden border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer & Service</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Order Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, idx) => {
                    const config = getStatusConfig(tx.status);
                    const icon = serviceIcons[tx.serviceType] || <Smartphone size={14} className="text-primary" />;
                    return (
                      <tr key={idx} className="tx-row hover:bg-slate-50/50 transition-all duration-300 group">
                        <td className="px-8 py-6">
                          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                            {tx.paymentId?.slice(-12) || tx.id?.toString().slice(-12) || 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              {icon} {tx.mobileNumber}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              <Mail size={12} /> {tx.userId?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-xl font-black text-slate-800 tracking-tight">₹{tx.amount.toFixed(2)}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{tx.serviceType || 'Mobile'} • {tx.operator || 'General'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${config.style}`}>
                              {config.icon} {config.label}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1 text-slate-500">
                            <p className="text-xs font-bold">{new Date(tx.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] font-medium">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all border border-slate-100 shadow-sm">
                            <ArrowRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-10 py-32 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <Activity size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">No activity logs found for current filter.</p>
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
            { label: 'Today Revenue', value: stats?.revenue ? `₹${stats.revenue.toLocaleString()}` : '₹0', icon: <DollarSign size={20} />, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Success Ratio', value: '98.4%', icon: <Activity size={20} />, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Failed Trans.', value: stats?.statusCounts?.failed || '0', icon: <XCircle size={20} />, color: 'text-rose-600 bg-rose-50' }
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

export default AdminTransactions;
