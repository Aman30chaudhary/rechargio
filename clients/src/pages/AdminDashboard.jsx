import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../services/api';
import { Users, CreditCard, DollarSign, Activity, TrendingUp, ChevronRight, LayoutDashboard, UserCheck, ShieldCheck, AlertCircle, ArrowUpRight, BarChart3, Settings, PieChart, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import gsap from 'gsap';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    revenue: 0,
    statusCounts: { success: 0, pending: 0, failed: 0 }
  });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStats();
    const ctx = gsap.context(() => {
      gsap.from('.admin-header', { y: -30, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.stat-card', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
      gsap.from('.dashboard-section', { y: 30, opacity: 0, duration: 1, delay: 0.6, stagger: 0.2, ease: 'power4.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%', trendUp: true },
    { title: 'Transactions', value: stats.totalTransactions, icon: <CreditCard size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+8.2%', trendUp: true },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+15.3%', trendUp: true },
    { title: 'Success Rate', value: '98.4%', icon: <Activity size={24} />, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-0.2%', trendUp: false }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Admin Header */}
        <div className="admin-header flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl text-white shadow-xl shadow-primary/20 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <LayoutDashboard size={32} className="md:hidden relative z-10" />
               <LayoutDashboard size={40} className="hidden md:block relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Admin <span className="text-primary">Terminal</span></h1>
              <p className="text-slate-500 font-bold text-sm md:text-lg mt-1">System health and transaction analytics.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/admin/settings" className="w-full sm:flex-1 md:flex-none">
              <Button variant="secondary" className="w-full">System Config</Button>
            </Link>
            <Button variant="primary" className="w-full sm:flex-1 md:flex-none px-8">Export Data</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <Card key={i} className="stat-card p-6 md:p-8 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10 space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${card.bg} ${card.color} shadow-sm border border-white`}>
                    {card.icon}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${card.trendUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDown size={14} />} {card.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.title}</p>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter">{card.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* Main Chart Area (Simplified Representation) */}
          <Card className="lg:col-span-2 p-6 md:p-10 space-y-8 md:space-y-10 dashboard-section">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">System Performance</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Daily transaction volume and success metrics.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                {['24H', '7D', '30D'].map(t => (
                  <button key={t} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${t === '7D' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-48 md:h-64 flex items-end gap-2 md:gap-3 px-2 md:px-4">
              {[60, 45, 75, 50, 90, 65, 80, 55, 70, 85, 40, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-50 rounded-t-lg md:rounded-t-xl relative group">
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-lg md:rounded-t-xl" 
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-slate-50">
              {[
                { label: 'Success', count: stats.statusCounts.success, color: 'bg-emerald-500' },
                { label: 'Pending', count: stats.statusCounts.pending, color: 'bg-amber-500' },
                { label: 'Failed', count: stats.statusCounts.failed, color: 'bg-rose-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-1 md:space-y-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.color}`} />
                    <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-lg md:text-2xl font-black text-slate-800">{item.count}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Side Panel: Quick Navigation */}
          <Card className="p-6 md:p-10 space-y-6 md:space-y-8 dashboard-section">
            <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">Admin Console</h4>
            <div className="space-y-4">
              {[
                { label: 'User Management', icon: <Users size={20} />, path: '/admin/users', color: 'text-blue-600 bg-blue-50' },
                { label: 'Transaction Logs', icon: <BarChart3 size={20} />, path: '/admin/transactions', color: 'text-indigo-600 bg-indigo-50' },
                { label: 'Portal Settings', icon: <Settings size={20} />, path: '/admin/settings', color: 'text-slate-600 bg-slate-50' },
                { label: 'Revenue Insights', icon: <PieChart size={20} />, path: '#', color: 'text-emerald-600 bg-emerald-50' }
              ].map((link, i) => (
                <Link 
                  key={i} 
                  to={link.path}
                  className="flex items-center justify-between p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group bg-white"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2.5 md:p-3 rounded-lg md:rounded-xl ${link.color} transition-colors group-hover:bg-primary group-hover:text-white`}>
                      {link.icon}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-700">{link.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
            
            {/* System Status Alert */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-start gap-4">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                  <UserCheck size={16} className="md:hidden" />
                  <UserCheck size={20} className="hidden md:block" />
               </div>
               <div>
                  <h5 className="text-xs md:text-sm font-black text-emerald-800 uppercase tracking-tight">All Systems Operational</h5>
                  <p className="text-emerald-600/70 text-[10px] md:text-xs font-medium mt-1">Last health check performed 2 mins ago.</p>
               </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
