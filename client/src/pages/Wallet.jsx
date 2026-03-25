import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Wallet as WalletIcon, Gift, History as HistoryIcon, Bell, ArrowUpRight, ArrowDownLeft, Plus, ChevronRight, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { Button, Card } from '../components/UI';
import HeroSection from '../components/HeroSection';
import gsap from 'gsap';

const Wallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    popupOffers: []
  });
  const [showPopup, setShowPopup] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchWalletDetails();
    const ctx = gsap.context(() => {
      gsap.from('.wallet-card', { y: 30, opacity: 0, duration: 1, delay: 0.5, ease: 'power4.out' });
      gsap.from('.stats-item', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.7, ease: 'power2.out' });
      gsap.from('.transaction-item', { x: -20, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.9, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const fetchWalletDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wallet/dummy_user_id');
      setWalletData(response.data);
      if (response.data.popupOffers.length > 0) {
        setActiveOffer(response.data.popupOffers[0]);
        setShowPopup(true);
      }
    } catch (err) {
      console.error('Failed to fetch wallet details');
    }
  };

  const features = [
    { icon: <TrendingUp size={20} />, title: 'Real-time Analytics', description: 'Track your spending and rewards with detailed graphical insights.' },
    { icon: <Gift size={20} />, title: 'Exclusive Rewards', description: 'Earn cashback and loyalty points on every transaction you make.' },
    { icon: <DollarSign size={20} />, title: 'Instant Withdrawals', description: 'Move your funds back to your bank account instantly, anytime.' }
  ];

  return (
    <div className="min-h-screen bg-background pt-16" ref={containerRef}>
      
      {/* Hero Section */}
      <HeroSection 
        title="Your Digital Vault, Simplified"
        description="Manage your funds, track rewards, and analyze your spending all in one place. The ultimate digital wallet for your daily needs."
        features={features}
        ctaText="Add Funds"
        onCtaClick={() => {}}
        reverse={true}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        
        {/* Balance & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Balance Card */}
          <div className="lg:col-span-2 wallet-card">
            <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-primary/10">
              <div className="bg-primary p-12 text-white relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-[60px]" />
                
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.4em]">Total Available Balance</p>
                      <h3 className="text-7xl font-black tracking-tighter">₹{walletData.balance.toFixed(2)}</h3>
                    </div>
                    <div className="p-6 bg-white/15 rounded-3xl backdrop-blur-xl border border-white/20">
                      <WalletIcon size={40} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-12 pt-10 border-t border-white/15">
                    <div className="space-y-1">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Total Cashback</p>
                      <p className="text-3xl font-black">₹4,560</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Monthly Rewards</p>
                      <p className="text-3xl font-black text-blue-200">₹1,240</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 flex flex-wrap gap-4">
                <Button className="flex-1 py-4" size="lg">Add Money</Button>
                <Button variant="secondary" className="flex-1 py-4" size="lg">Transfer to Bank</Button>
              </div>
            </Card>
          </div>

          {/* Side Stats/Quick Links */}
          <div className="space-y-6 stats-item">
            <Card className="p-8 space-y-8">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'History', icon: <HistoryIcon />, color: 'text-primary bg-primary/5' },
                  { label: 'Offers', icon: <Gift />, color: 'text-orange-500 bg-orange-50' },
                  { label: 'Analysis', icon: <PieChart />, color: 'text-green-500 bg-green-50' },
                  { label: 'Security', icon: <Bell />, color: 'text-purple-500 bg-purple-50' }
                ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                    <div className={`p-4 rounded-xl ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Referral Mini Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10 space-y-4">
                  <h5 className="text-lg font-black tracking-tight leading-tight">Invite Friends & Earn ₹50</h5>
                  <p className="text-white/60 text-xs font-medium">Share your code and get rewards on their first recharge.</p>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs py-3">RECH50</Button>
               </div>
            </div>
          </div>

        </div>

        {/* Recent Transactions */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-2">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
              <p className="text-slate-500 font-medium">Your latest wallet transactions and rewards.</p>
            </div>
            <button className="text-primary font-bold text-sm hover:underline">View All History</button>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {walletData.transactions.length > 0 ? (
                walletData.transactions.slice(0, 5).map((tx, i) => (
                  <div key={i} className="transaction-item p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{tx.description}</p>
                        <p className="text-xs text-slate-400 font-medium">{new Date(tx.date).toLocaleDateString()} • {tx.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-green-500' : 'text-slate-800'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Success</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <HistoryIcon size={32} />
                  </div>
                  <p className="text-slate-400 font-bold">No recent transactions found.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Popup Offer */}
      {showPopup && activeOffer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="max-w-md w-full p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Gift size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{activeOffer.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{activeOffer.description}</p>
            </div>
            <div className="space-y-3">
              <Button className="w-full py-4 font-black uppercase tracking-widest">Claim Offer</Button>
              <Button variant="ghost" className="w-full font-bold" onClick={() => setShowPopup(false)}>Maybe Later</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default Wallet;
