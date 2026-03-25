import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Settings, Percent, Gift, Bell, Save, Trash2, PlusCircle, AlertCircle, Eye, ChevronRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Input } from '../components/UI';
import gsap from 'gsap';

const AdminSettings = () => {
  const [margin, setMargin] = useState(5);
  const [cashbackRule, setCashbackRule] = useState({ minAmount: 100, cashbackPercent: 5 });
  const [popupOffer, setPopupOffer] = useState({ title: '', description: '' });
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.admin-header', { y: -30, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.settings-card', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleUpdateMargin = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/settings', { distributorMargin: margin });
      toast.success('Distributor margin updated successfully!');
    } catch (err) {
      toast.error('Failed to update margin');
    }
  };

  const handleCreateCashback = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/cashback-rules', cashbackRule);
      toast.success('Cashback rule created!');
    } catch (err) {
      toast.error('Failed to create cashback rule');
    }
  };

  const handleCreatePopup = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/popup-offers', popupOffer);
      toast.success('Popup offer created!');
      setPopupOffer({ title: '', description: '' });
    } catch (err) {
      toast.error('Failed to create popup offer');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="admin-header flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-3xl text-white shadow-xl shadow-primary/20 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <Settings size={40} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase italic">Portal <span className="text-primary">Configuration</span></h1>
              <p className="text-slate-500 font-bold text-lg mt-1">Adjust revenue margins and user engagement rules.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 border-slate-200">
            <ShieldCheck size={18} /> View Audit Logs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Revenue & Margin Control */}
          <div className="space-y-8 settings-card">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
                <Percent size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Revenue Margin</h3>
            </div>
            
            <Card className="p-10 space-y-8 border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-6 flex gap-5 border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Set the margin percentage to keep on each transaction. 
                  </p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">Calculated per transaction</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input 
                  label="Margin Percentage (%)"
                  type="number" 
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="text-2xl font-black py-4"
                />
                <Button onClick={handleUpdateMargin} className="w-full py-4 text-sm font-black uppercase tracking-widest">
                  Update System Margin
                </Button>
              </div>
            </Card>
          </div>

          {/* Cashback Rules */}
          <div className="space-y-8 settings-card">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
                <Heart size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Reward Engine</h3>
            </div>
            
            <Card className="p-10 space-y-8 border-slate-100">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input 
                  label="Min. Amount (₹)"
                  type="number" 
                  value={cashbackRule.minAmount}
                  onChange={(e) => setCashbackRule({ ...cashbackRule, minAmount: e.target.value })}
                />
                <Input 
                  label="Cashback (%)"
                  type="number" 
                  value={cashbackRule.cashbackPercent}
                  onChange={(e) => setCashbackRule({ ...cashbackRule, cashbackPercent: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateCashback} variant="secondary" className="w-full py-4 text-sm font-black uppercase tracking-widest">
                Save Reward Rules
              </Button>
            </Card>
          </div>

          {/* Engagement: Popup Offers */}
          <div className="lg:col-span-2 space-y-8 settings-card">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 shadow-sm">
                <Zap size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Engagement Campaigns</h3>
            </div>
            
            <Card className="p-10 border-slate-100">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-6">
                  <Input 
                    label="Campaign Title"
                    placeholder="e.g. Weekend Special Offer"
                    value={popupOffer.title}
                    onChange={(e) => setPopupOffer({ ...popupOffer, title: e.target.value })}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Campaign Description</label>
                    <textarea 
                      rows="4"
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                      placeholder="Detail the rewards and conditions..."
                      value={popupOffer.description}
                      onChange={(e) => setPopupOffer({ ...popupOffer, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreatePopup} className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    <PlusCircle size={18} className="mr-2" /> Launch Campaign
                  </Button>
                </div>

                <div className="lg:w-80 space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preview Terminal</p>
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white aspect-[4/5] flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 relative z-10">
                      <Gift size={32} />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <h4 className="text-xl font-black tracking-tight leading-none uppercase italic">{popupOffer.title || 'Your Title Here'}</h4>
                      <p className="text-white/50 text-xs font-medium px-4">{popupOffer.description || 'Campaign description will appear here for users.'}</p>
                    </div>
                    <button className="w-full py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all relative z-10">Claim Now</button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
