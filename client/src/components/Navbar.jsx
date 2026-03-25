import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Smartphone, Wallet, History, User, LogOut, 
  Settings, LayoutDashboard, Moon, Sun, Bell, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './UI';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Recharge', path: '/recharge', icon: <Smartphone size={18} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
    { name: 'History', path: '/history', icon: <History size={18} /> },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <LayoutDashboard size={18} /> });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
            <Smartphone size={24} strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-none">Rechargio</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1 bg-card/50 p-1.5 rounded-2xl border border-border">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted hover:text-foreground hover:bg-background'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-border">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-3 bg-card border border-border rounded-xl text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button className="relative p-3 bg-card border border-border rounded-xl text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-card" />
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-black text-foreground leading-none">{user.displayName || 'User'}</p>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-1">Premium Member</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm group"
                >
                  <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-card border border-border rounded-xl text-muted"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path
                      ? 'bg-primary text-white'
                      : 'text-muted hover:bg-background'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-4">
                {user ? (
                  <Button onClick={handleLogout} variant="secondary" className="w-full text-rose-500">
                    <LogOut size={18} /> Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
