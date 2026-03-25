import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, Users, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../components/UI';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <MessageSquare size={20} />, label: 'Chat', path: '/chat' },
    { icon: <Users size={20} />, label: 'Team', path: '/team' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-text">SaaS<span className="text-primary">Chat</span></span>
          </Link>
          <button className="md:hidden text-text-muted" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button 
            className="md:hidden text-text-muted hover:text-text"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
