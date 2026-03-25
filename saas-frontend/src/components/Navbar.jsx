import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, MessageSquare } from 'lucide-react';
import { Button } from './UI';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Features', path: '#features' },
    { name: 'Pricing', path: '#pricing' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chat', path: '/chat' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <Link to="/" className="text-xl font-bold text-text tracking-tight">
              SaaS<span className="text-primary">Chat</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-text-muted">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-muted">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block px-3 py-2 text-base font-medium text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" className="w-full">Log in</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
