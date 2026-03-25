import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Smartphone, CheckCircle2, XCircle, ChevronLeft, CreditCard, 
  ShieldCheck, Zap, Bell, Shield, Globe, Phone, Tv, Flame, Droplets, ArrowLeft
} from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import HeroSection from '../components/HeroSection';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Recharge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service || 'Mobile';
  
  // Dynamic state based on service fields
  const [formData, setFormData] = useState(location.state || {});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const containerRef = useRef(null);

  const serviceConfig = {
    'Mobile': { 
      title: 'Mobile Recharge', 
      icon: <Smartphone size={20} />, 
      description: 'Recharge your mobile instantly.',
      fields: [
        { name: 'mobileNumber', label: 'Mobile Number', placeholder: 'Enter 10 digit number', type: 'text', maxLength: 10 },
        { name: 'operator', label: 'Operator', placeholder: 'Select Operator', type: 'select', options: ['Airtel', 'Jio', 'VI', 'BSNL'] },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
    'Card': { 
      title: 'Credit Card Bill', 
      icon: <CreditCard size={20} />, 
      description: 'Pay your credit card bills securely.',
      fields: [
        { name: 'cardNumber', label: 'Card Number', placeholder: 'Enter 16 digit card number', type: 'text', maxLength: 16 },
        { name: 'cardHolder', label: 'Card Holder Name', placeholder: 'Name on card', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Bill Amount', type: 'number' }
      ]
    },
    'Broadband': { 
      title: 'Broadband Bill', 
      icon: <Globe size={20} />, 
      description: 'High-speed internet bill payment.',
      fields: [
        { name: 'operator', label: 'Provider', placeholder: 'Select Provider', type: 'select', options: ['Airtel Xstream', 'Jio Fiber', 'BSNL Bharat Fiber', 'ACT Fibernet'] },
        { name: 'accountNumber', label: 'Account Number', placeholder: 'User ID / Account Number', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
    'Landline': { 
      title: 'Landline Bill', 
      icon: <Phone size={20} />, 
      description: 'Fixed-line telephone bill payment.',
      fields: [
        { name: 'operator', label: 'Operator', placeholder: 'Select Operator', type: 'select', options: ['Airtel', 'BSNL', 'MTNL', 'Jio'] },
        { name: 'phoneNumber', label: 'Phone Number', placeholder: 'Number with STD Code', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Bill Amount', type: 'number' }
      ]
    },
    'CableTv': { 
      title: 'Cable TV / DTH', 
      icon: <Tv size={20} />, 
      description: 'DTH and Cable TV recharge.',
      fields: [
        { name: 'operator', label: 'Operator', placeholder: 'Select Operator', type: 'select', options: ['Tata Play', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'] },
        { name: 'subscriberId', label: 'Subscriber ID', placeholder: 'Subscriber ID / Customer ID', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
    'Electricity': { 
      title: 'Electricity Bill', 
      icon: <Zap size={20} />, 
      description: 'Power up your home instantly.',
      fields: [
        { name: 'board', label: 'Electricity Board', placeholder: 'Select Electricity Board', type: 'select', options: ['BESCOM', 'MSEDC', 'TNEB', 'UPPCL', 'Adani Electricity'] },
        { name: 'consumerNumber', label: 'Consumer Number', placeholder: 'Enter Consumer Number', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
    'Gas': { 
      title: 'Gas Bill', 
      icon: <Flame size={20} />, 
      description: 'Piped gas bill payment.',
      fields: [
        { name: 'operator', label: 'Gas Provider', placeholder: 'Select Gas Provider', type: 'select', options: ['Indane', 'HP Gas', 'Bharat Gas', 'Adani Gas'] },
        { name: 'consumerId', label: 'Consumer ID', placeholder: 'Consumer ID / Customer Number', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
    'Water': { 
      title: 'Water Bill', 
      icon: <Droplets size={20} />, 
      description: 'Clean water bill payment.',
      fields: [
        { name: 'board', label: 'Water Board', placeholder: 'Select Water Board', type: 'select', options: ['BWSSB', 'DJB', 'MCGM', 'HMWSSB'] },
        { name: 'consumerId', label: 'Consumer ID', placeholder: 'RR Number / Consumer ID', type: 'text' },
        { name: 'amount', label: 'Amount', placeholder: 'Enter Amount', type: 'number' }
      ]
    },
  };

  const currentService = serviceConfig[service] || serviceConfig['Mobile'];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (service === 'Mobile' && formData.mobileNumber?.length >= 4) {
      detectOperator();
    }
  }, [formData.mobileNumber]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.recharge-form', { y: 30, opacity: 0, duration: 1, delay: 0.5, ease: 'power4.out' });
      gsap.from('.plan-card', { scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.7, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const detectOperator = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/recharge/detect-operator', { mobileNumber: formData.mobileNumber });
      setFormData(prev => ({ ...prev, operator: response.data.operator }));
    } catch (err) {
      console.error('Operator detection failed');
    }
  };

  const handleRecharge = async () => {
    // Basic validation
    const missingField = currentService.fields.find(f => !formData[f.name]);
    if (missingField) {
      toast.error(`Please provide ${missingField.label}`);
      return;
    }

    setLoading(true);
    try {
      const amount = parseInt(formData.amount);
      const orderRes = await axios.post('http://localhost:5000/api/recharge/create-order', { amount });
      const order = orderRes.data;

      const options = {
        key: 'your_razorpay_key_id',
        amount: order.amount,
        currency: order.currency,
        name: "Rechargio",
        description: `${service} Payment`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/recharge/verify-payment', {
              ...response,
              amount,
              service,
              details: formData,
              userId: 'dummy_user_id'
            });

            if (verifyRes.data.status === 'success') {
              toast.success(`${service} Payment Successful!`);
              setStep(3);
            } else {
              toast.error('Payment Failed. Please try again.');
            }
          } catch (err) {
            toast.error('Payment Verification Failed');
          }
        },
        theme: { color: "#3B52DF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 1, price: 299, validity: '28 Days', data: '1.5GB/Day', desc: 'Unlimited Calls' },
    { id: 2, price: 599, validity: '56 Days', data: '2GB/Day', desc: 'OTT Subscription' },
    { id: 3, price: 899, validity: '84 Days', data: '2.5GB/Day', desc: 'Best Seller' },
    { id: 4, price: 1999, validity: '365 Days', data: '2GB/Day', desc: 'Annual Plan' },
  ];

  const features = [
    { icon: <Zap size={20} />, title: 'Instant Processing', description: 'Experience the fastest processing with our direct API integrations.' },
    { icon: <Shield size={20} />, title: 'Secure Payments', description: 'Every transaction is encrypted and secured by industry-standard protocols.' },
    { icon: <Bell size={20} />, title: 'Smart Alerts', description: 'Never miss a payment with our intelligent reminder system.' }
  ];

  return (
    <div className="min-h-screen bg-background pt-16" ref={containerRef}>
      
      {/* Hero Section */}
      <HeroSection 
        title={`Quick & Easy ${currentService.title}`}
        description={currentService.description}
        features={features}
        ctaText="Pay Now"
        onCtaClick={() => document.getElementById('recharge-form').scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Main Content Area */}
      <div id="recharge-form" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-primary">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{currentService.title}</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left: Recharge Form */}
          <div className="lg:col-span-1 recharge-form">
            <Card className="p-10 space-y-8 sticky top-32">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {currentService.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Enter Details</h3>
                </div>
                <p className="text-sm text-slate-500 font-medium">Please provide the required details to continue.</p>
              </div>

              <div className="space-y-6">
                {currentService.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    {field.type === 'select' ? (
                      <>
                        <label className="text-sm font-bold text-slate-600 ml-1">{field.label}</label>
                        <div className="relative">
                          <select 
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-700 appearance-none text-sm font-medium"
                          >
                            <option value="">{field.placeholder}</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <ChevronLeft size={16} className="-rotate-90" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Input 
                        label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        type={field.type}
                        maxLength={field.maxLength}
                      />
                    )}
                  </div>
                ))}

                <Button 
                  onClick={handleRecharge} 
                  isLoading={loading}
                  className="w-full py-4 text-sm font-black uppercase tracking-wider mt-4"
                  size="lg"
                >
                  Pay Now
                </Button>

                <div className="flex items-center justify-center gap-3 pt-4 text-slate-400">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secure Gateway Protected</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Best Plans or Info */}
          <div className="lg:col-span-2 space-y-10">
            {service === 'Mobile' ? (
              <>
                <div className="flex justify-between items-end px-2">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Recommended Plans</h3>
                    <p className="text-slate-500 font-medium">Choose the best plan for your operator.</p>
                  </div>
                  <button className="text-primary font-bold text-sm hover:underline">View All Plans</button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className="plan-card group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                      onClick={() => handleInputChange('amount', plan.price.toString())}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-sm font-black text-primary uppercase tracking-wider">{plan.validity}</span>
                            <h4 className="text-4xl font-black text-slate-800 tracking-tighter">₹{plan.price}</h4>
                          </div>
                          <div className="space-y-2">
                            <p className="text-slate-600 font-bold flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-green-500" /> {plan.data}
                            </p>
                            <p className="text-slate-500 text-sm font-medium">{plan.desc}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">Bill Payment Information</h3>
                  <p className="text-slate-500 font-medium">Quick and secure way to pay your {currentService.title.toLowerCase()}.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                    <h4 className="text-lg font-bold text-slate-700">How to pay?</h4>
                    <ul className="space-y-3">
                      {[
                        'Select your service provider from the list.',
                        'Enter your unique consumer/account number.',
                        'Enter the bill amount as mentioned on your statement.',
                        'Click "Pay Now" to complete the transaction.'
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{i+1}</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4 p-6 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="text-lg font-bold text-primary">Benefits</h4>
                    <ul className="space-y-3">
                      {[
                        'Instant payment confirmation',
                        '24/7 payment facility',
                        'Automatic bill reminders',
                        'Secure transaction history'
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                          <CheckCircle2 size={18} className="text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Promo Card */}
            <div className="bg-primary/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-10 border border-primary/10">
               <div className="flex-1 space-y-4 text-center md:text-left">
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Pay Bills, Earn Cashback!</h4>
                  <p className="text-slate-500 font-medium">Get up to 5% cashback on all utility bill payments. Use code BILLSAVE at checkout.</p>
                  <div className="pt-4">
                    <Button variant="outline">Copy Code: BILLSAVE</Button>
                  </div>
               </div>
               <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/5 border border-primary/5 shrink-0">
                  <div className="text-center">
                    <p className="text-4xl font-black text-primary">5%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cashback</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Recharge;
