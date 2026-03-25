import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Smartphone, Clock, CheckCircle2, XCircle, Search, Filter, ArrowRight, 
  Download, Calendar, ShieldCheck, CreditCard, List, Globe, Phone, Tv, Zap, Flame, Droplets
} from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import HeroSection from '../components/HeroSection';
import gsap from 'gsap';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  const serviceIcons = {
    'Mobile': <Smartphone size={24} />,
    'Card': <CreditCard size={24} />,
    'Broadband': <Globe size={24} />,
    'Landline': <Phone size={24} />,
    'CableTv': <Tv size={24} />,
    'Electricity': <Zap size={24} />,
    'Gas': <Flame size={24} />,
    'Water': <Droplets size={24} />,
  };

  useEffect(() => {
    fetchHistory();
    const ctx = gsap.context(() => {
      gsap.from('.filter-card', { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: 'power4.out' });
      gsap.from('.history-item', { x: -20, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.7, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wallet/dummy_user_id');
      setHistory(response.data.transactions);
    } catch (err) {
      console.error('Failed to fetch transaction history');
    }
  };

  const filteredHistory = history.filter(tx => 
    (filter === 'all' || tx.status === filter) &&
    ((tx.description?.toLowerCase() || tx.mobileNumber || tx.serviceType || '').toLowerCase().includes(search.toLowerCase()) || tx.id?.includes(search) || tx.paymentId?.includes(search))
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success': return { 
        style: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
        icon: <CheckCircle2 size={14} />,
        label: 'Success'
      };
      case 'failed': return { 
        style: 'bg-rose-50 text-rose-600 border-rose-100', 
        icon: <XCircle size={14} />,
        label: 'Failed'
      };
      default: return { 
        style: 'bg-amber-50 text-amber-600 border-amber-100', 
        icon: <Clock size={14} />,
        label: 'Pending'
      };
    }
  };

  const features = [
    { icon: <List size={20} />, title: 'Detailed Logs', description: 'Access comprehensive details for every transaction including operator IDs and timestamps.' },
    { icon: <Calendar size={20} />, title: 'Smart Filtering', description: 'Easily filter by status, date, or search for specific transactions instantly.' },
    { icon: <ShieldCheck size={20} />, title: 'Verified Records', description: 'Every entry in your history is cryptographically verified and immutable.' }
  ];

  return (
    <div className="min-h-screen bg-background pt-16" ref={containerRef}>
      
      {/* Hero Section */}
      <HeroSection 
        title="Transaction History & Activity"
        description="Keep track of all your recharges, bill payments, and wallet activities with our transparent and detailed activity logs."
        features={features}
        ctaText="Export History"
        onCtaClick={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-10">
        
        {/* Filters & Search */}
        <div className="filter-card">
          <Card className="p-6 flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search transactions..." 
                className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-700 font-medium text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar">
              {['all', 'success', 'pending', 'failed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    filter === f ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">All Transactions</h3>
            <p className="text-sm text-slate-400 font-bold">{filteredHistory.length} Results found</p>
          </div>

          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((tx, idx) => {
                const config = getStatusConfig(tx.status);
                const icon = tx.type === 'credit' ? <Download size={24} /> : (serviceIcons[tx.serviceType] || <Smartphone size={24} />);
                return (
                  <Card key={idx} className="history-item p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'}`}>
                          {icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{tx.description || tx.mobileNumber}</h4>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.style} flex items-center gap-1.5`}>
                              {config.icon} {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {tx.serviceType && <span className="text-primary font-bold">{tx.serviceType} • </span>}
                            {new Date(tx.createdAt || tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Ref: {tx.paymentId || tx.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-right">
                          <p className={`text-2xl font-black tracking-tight ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                            {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Amount</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="py-24 text-center space-y-6 border-dashed border-2 border-slate-100 bg-slate-50/30">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto text-slate-200 shadow-sm border border-slate-50">
                  <Clock size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">No Transactions Found</h4>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
                <div className="pt-4">
                  <Button variant="outline" onClick={() => { setFilter('all'); setSearch(''); }}>Clear All Filters</Button>
                </div>
              </Card>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default History;
