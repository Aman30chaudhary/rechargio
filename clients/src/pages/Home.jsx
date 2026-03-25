import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  Smartphone, CreditCard, Globe, Phone, Tv, Zap, Flame, Droplets, 
  ChevronDown, ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { rechargeService } from '../services/api';

import HeroSection from '../components/HeroSection';
import heroImage from '../assets/hero.png';

const Home = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Mobile');
  const [rechargeType, setRechargeType] = useState('Prepaid');
  const [dynamicOffers, setDynamicOffers] = useState([]);
  const [formData, setFormData] = useState({});
  const [loadingOffers, setLoadingOffers] = useState(false);
  const offersScrollRef = useRef(null);

  const serviceFields = {
    'Mobile': [
      { name: 'mobileNumber', type: 'text', placeholder: 'Enter Mobile Number', maxLength: 10 },
      { name: 'operator', type: 'select', placeholder: 'Select Your Operator', options: ['Airtel', 'Jio', 'VI', 'BSNL'] },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ],
    'Card': [
      { name: 'cardNumber', type: 'text', placeholder: 'Enter Card Number', maxLength: 16 },
      { name: 'cardHolder', type: 'text', placeholder: 'Card Holder Name' },
      { name: 'amount', type: 'text', placeholder: 'Enter Bill Amount' }
    ],
    'Broadband': [
      { name: 'operator', type: 'select', placeholder: 'Select Provider', options: ['Airtel Xstream', 'Jio Fiber', 'BSNL Bharat Fiber', 'ACT Fibernet'] },
      { name: 'accountNumber', type: 'text', placeholder: 'User ID / Account Number' },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ],
    'Landline': [
      { name: 'operator', type: 'select', placeholder: 'Select Operator', options: ['Airtel', 'BSNL', 'MTNL', 'Jio'] },
      { name: 'phoneNumber', type: 'text', placeholder: 'Number with STD Code' },
      { name: 'amount', type: 'text', placeholder: 'Enter Bill Amount' }
    ],
    'CableTv': [
      { name: 'operator', type: 'select', placeholder: 'Select Operator', options: ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'] },
      { name: 'subscriberId', type: 'text', placeholder: 'Subscriber ID / Customer ID' },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ],
    'Electricity': [
      { name: 'board', type: 'select', placeholder: 'Select Electricity Board', options: ['BESCOM', 'MSEDC', 'TNEB', 'UPPCL', 'Adani Electricity'] },
      { name: 'consumerNumber', type: 'text', placeholder: 'Consumer Number' },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ],
    'Gas': [
      { name: 'operator', type: 'select', placeholder: 'Select Gas Provider', options: ['Indane', 'HP Gas', 'Bharat Gas', 'Adani Gas'] },
      { name: 'consumerId', type: 'text', placeholder: 'Consumer ID / Customer Number' },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ],
    'Water': [
      { name: 'board', type: 'select', placeholder: 'Select Water Board', options: ['BWSSB', 'DJB', 'MCGM', 'HMWSSB'] },
      { name: 'consumerId', type: 'text', placeholder: 'RR Number / Consumer ID' },
      { name: 'amount', type: 'text', placeholder: 'Enter Amount' }
    ]
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const fields = serviceFields[activeTab];
    return fields.every(field => formData[field.name] && formData[field.name].toString().trim().length > 0);
  };

  const scrollOffers = (direction) => {
    if (offersScrollRef.current) {
      const scrollAmount = 150;
      offersScrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'Mobile' && formData.mobileNumber?.length >= 4) {
      detectOperator();
    } else if (activeTab === 'Mobile') {
      setFormData(prev => ({ ...prev, operator: '' }));
      setDynamicOffers([]);
    }
  }, [formData.mobileNumber, activeTab]);

  useEffect(() => {
    if (activeTab === 'Mobile' && formData.operator) {
      fetchOffers();
    }
  }, [formData.operator, activeTab]);

  const fetchOffers = async () => {
    setLoadingOffers(true);
    try {
      const response = await rechargeService.getOffers(formData.operator);
      setDynamicOffers(response.data);
    } catch (err) {
      console.error('Failed to fetch offers');
    } finally {
      setLoadingOffers(false);
    }
  };

  const detectOperator = async () => {
    try {
      const response = await rechargeService.detectOperator(formData.mobileNumber);
      setFormData(prev => ({ ...prev, operator: response.data.operator }));
    } catch (err) {
      console.error('Operator detection failed');
    }
  };

  const handleContinue = () => {
    if (isFormValid()) {
      navigate('/recharge', { state: { ...formData, service: activeTab } });
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setFormData({}); // Clear form data when switching tabs
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-in', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const tabs = [
    { name: 'Mobile', icon: <Smartphone size={20} /> },
    { name: 'Card', icon: <CreditCard size={20} /> },
    { name: 'Broadband', icon: <Globe size={20} /> },
    { name: 'Landline', icon: <Phone size={20} /> },
    { name: 'CableTv', icon: <Tv size={20} /> },
    { name: 'Electricity', icon: <Zap size={20} /> },
    { name: 'Gas', icon: <Flame size={20} /> },
    { name: 'Water', icon: <Droplets size={20} /> },
  ];

  const promoCodes = [
    { id: 1, brand: 'Airtel', code: 'SWyroSruq2Eu', logo: 'https://logo.clearbit.com/airtel.in' },
    { id: 2, brand: 'PayPal', code: 'OayKSh7Xmr0O', logo: 'https://logo.clearbit.com/paypal.com' },
    { id: 3, brand: 'SBI', code: 'qMgxjZk0fxWz', logo: 'https://logo.clearbit.com/sbi.co.in' },
    { id: 4, brand: 'Mastercard', code: 'R2r0UAWdFeUW', logo: 'https://logo.clearbit.com/mastercard.com' },
    { id: 5, brand: 'Jio', code: 'gsXAMqnklxbr', logo: 'https://logo.clearbit.com/jio.com' },
    { id: 6, brand: 'Quora', code: 'Hr0A4OKcB6qH', logo: 'https://logo.clearbit.com/quora.com' },
    { id: 7, brand: 'Visa', code: 'L8sMlo3UvLFz', logo: 'https://logo.clearbit.com/visa.com' },
    { id: 8, brand: 'VI', code: '7e12J7hQ4Xia', logo: 'https://logo.clearbit.com/vi.in' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background transition-colors duration-300">
      {/* Service Selection Section */}
      <section id="services-tabs" className="pt-32 pb-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Service Tabs */}
          <div className="fade-in flex flex-nowrap lg:justify-center gap-4 overflow-x-auto pb-6 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabChange(tab.name)}
                className={`service-tab flex-shrink-0 min-w-[140px] flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border-2 ${
                  activeTab === tab.name 
                    ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
                    : 'bg-card text-muted border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <span className={activeTab === tab.name ? 'text-white' : 'text-primary'}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Recharge Card */}
          <div className="fade-in grid lg:grid-cols-3 gap-10 items-stretch">
            <Card className="lg:col-span-2 p-8 md:p-16 flex flex-col justify-center">
              <div className="space-y-12 text-center max-w-2xl mx-auto w-full">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight italic uppercase">
                    {activeTab} <span className="text-primary">Payment</span>
                  </h2>
                  <p className="text-muted font-bold text-sm tracking-widest uppercase">Fast • Secure • Instant</p>
                </div>
                
                {/* Prepaid/Postpaid Radio */}
                <div className="flex justify-center gap-12 bg-background/50 p-2 rounded-2xl border border-border inline-flex mx-auto self-center">
                  <label className="flex items-center gap-3 cursor-pointer group px-6 py-2.5 rounded-xl transition-all has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg">
                    <input 
                      type="radio" 
                      name="rechargeType" 
                      checked={rechargeType === 'Prepaid'}
                      onChange={() => setRechargeType('Prepaid')}
                      className="hidden"
                    />
                    <span className="text-xs font-black uppercase tracking-widest">Prepaid</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group px-6 py-2.5 rounded-xl transition-all has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg">
                    <input 
                      type="radio" 
                      name="rechargeType" 
                      checked={rechargeType === 'Postpaid'}
                      onChange={() => setRechargeType('Postpaid')}
                      className="hidden"
                    />
                    <span className="text-xs font-black uppercase tracking-widest">Postpaid</span>
                  </label>
                </div>

                {/* Form Vertical Stack */}
                <div className="flex flex-col gap-8 w-full">
                  {serviceFields[activeTab].map((field) => (
                    <div key={field.name} className="relative group">
                      {field.type === 'select' ? (
                        <div className="relative">
                          <select 
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-8 py-5 bg-background border-2 border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground appearance-none text-sm font-black uppercase tracking-widest shadow-sm"
                          >
                            <option value="">{field.placeholder}</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                        </div>
                      ) : (
                        <input 
                          type={field.type} 
                          placeholder={field.placeholder} 
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          maxLength={field.maxLength}
                          className="w-full px-8 py-5 bg-background border-2 border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground placeholder:text-muted/50 text-sm font-black uppercase tracking-widest shadow-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    variant="glow"
                    size="lg"
                    className="w-full max-w-md mx-auto"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </Card>

            {/* Promo Banner / Dynamic Offers */}
            <div className="hidden lg:block relative group h-full">
              {!formData.mobileNumber ? (
                <div className="h-full rounded-3xl bg-primary flex flex-col items-center justify-center text-center p-12 text-white shadow-2xl overflow-hidden relative">
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[60px] border-white rounded-full opacity-10 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[30px] border-white rounded-full opacity-5" />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <p className="text-xs font-black tracking-[0.5em] uppercase opacity-80">FLASH DEAL</p>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black leading-none tracking-tighter italic">
                        RECHARGE
                      </h3>
                      <div className="inline-block relative">
                        <span className="text-6xl font-black leading-none border-y-4 border-white/30 py-4 px-8 block italic">
                          OFFER
                        </span>
                      </div>
                      <p className="text-sm font-bold opacity-70 tracking-widest uppercase">Up to 50% Cashback</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full rounded-3xl bg-card border-2 border-border flex flex-col p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Best <span className="text-primary">Offers</span></h3>
                      <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">Personalized for you</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => scrollOffers('up')}
                        className="w-10 h-10 rounded-xl bg-background border-2 border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
                      >
                        <ChevronDown size={20} className="rotate-180" />
                      </button>
                      <button 
                        onClick={() => scrollOffers('down')}
                        className="w-10 h-10 rounded-xl bg-background border-2 border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>

                  <div 
                    ref={offersScrollRef}
                    className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 min-h-[300px]"
                  >
                    {loadingOffers ? (
                      <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-primary uppercase tracking-widest">Fetching Best Offers...</p>
                      </div>
                    ) : dynamicOffers.length > 0 ? (
                      dynamicOffers.map((offer) => (
                        <div 
                          key={offer.id} 
                          onClick={() => handleInputChange('amount', offer.price.toString())}
                          className="p-5 bg-background border-2 border-border rounded-2xl hover:border-primary hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-all" />
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-lg font-black text-primary italic">₹{offer.price}</span>
                            <span className="text-[10px] font-black text-muted bg-card border border-border px-3 py-1 rounded-full uppercase tracking-wider">{offer.validity}</span>
                          </div>
                          <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-1">{offer.title}</h4>
                          <p className="text-xs text-muted font-medium line-clamp-2 leading-relaxed">{offer.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-50">
                        <Smartphone size={40} className="text-muted mb-4" />
                        <p className="text-xs font-black text-muted uppercase tracking-widest">No offers found</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] text-center">Tap to Select</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="fade-in space-y-8 pt-12">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Promo Code</h2>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                  <ChevronLeft size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoCodes.map((promo) => (
                <div key={promo.id} className="p-5 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-all group flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border border-slate-50 rounded-lg bg-slate-50/50 p-2 overflow-hidden">
                    <img 
                      src={promo.logo} 
                      alt={promo.brand} 
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${promo.brand}&background=3B52DF&color=fff`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-1">{promo.brand}</p>
                    <p className="text-sm font-bold text-slate-700 truncate mb-1">{promo.code}</p>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 transition-all group-hover:translate-x-1">
                      Apply <ArrowRight size={12} className="stroke-[3px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Hero Section with Illustration (Moved to second place) */}
      <HeroSection 
        title="Modern Digital Recharge Made Simple"
        description="Experience the fastest way to recharge your mobile, pay bills, and manage your digital assets. Secure, reliable, and incredibly fast."
        ctaText="Learn More"
        onCtaClick={() => {}}
        illustration={<img src={heroImage} alt="Hero Illustration" className="w-full h-auto object-contain" />}
        reverse={true} 
      />

      {/* Refer & Earn Section (Matching second image) */}
      <div className="bg-white/50 py-10">
        <HeroSection 
          title="Refer & Earn"
          description="Refer your friends and earn up to ₹20. There are many variations of passages of Lorem Ipsum available, but the have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
          features={[
            { icon: <Smartphone size={18} className="text-primary" />, title: 'Refer your friends', description: 'Share your referral link with friends. They get ₹10.' },
            { icon: <CreditCard size={18} className="text-primary" />, title: 'Register your friends', description: 'Your friends Register with using your referral link.' },
            { icon: <Zap size={18} className="text-primary" />, title: 'Earn You', description: '₹20. You can use these credits to take recharge.' }
          ]}
          ctaText="Get Started Earn"
          onCtaClick={() => {}}
          reverse={true}
        />
      </div>

      {/* Footer Branding (Image-like) */}
      <footer className="py-10 text-center border-t border-gray-100 bg-white">
        <p className="text-sm text-text-muted font-medium">
          © 2024 Rechargio. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
