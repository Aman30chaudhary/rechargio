import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-form', { x: -30, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.login-illustration', { x: 30, opacity: 0, duration: 1, ease: 'power4.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-6" ref={containerRef}>
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Login Form */}
        <div className="login-form flex-1 max-w-lg w-full">
          <Card className="p-12 space-y-10 shadow-2xl shadow-primary/10">
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Please enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input 
                label="Email Address"
                placeholder="e.g. name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <Link to="#" className="text-primary font-bold hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="w-full py-4 text-sm font-black uppercase tracking-widest" size="lg">
                Sign In to Account
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-50 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account? <Link to="/register" className="text-primary font-black hover:underline">Create Account</Link>
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Illustration & Features */}
        <div className="login-illustration flex-1 hidden lg:block space-y-12">
          <div className="relative">
            <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-primary/5 to-primary/20 rounded-[64px] relative overflow-hidden flex items-center justify-center">
               {/* Simplified Illustration Elements */}
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border-8 border-primary rounded-full" />
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-8 border-primary rounded-full" />
               </div>
               <div className="relative z-10 text-center space-y-4">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto text-primary rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <ShieldCheck size={48} />
                  </div>
                  <p className="text-primary font-black text-2xl tracking-tighter uppercase italic">Secure Gateway</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-lg">
            {[
              { icon: <Zap size={20} />, title: 'Lightning Fast', desc: 'Instant access to your digital wallet.' },
              { icon: <Star size={20} />, title: 'Premium Support', desc: '24/7 assistance for all your needs.' }
            ].map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit">{f.icon}</div>
                <h4 className="text-lg font-bold text-slate-800 leading-tight">{f.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
