import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon, ShieldCheck, Briefcase } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

const BREADCRUMB_LABELS = {
  dashboard: 'Dashboard',
  farmers: 'Farmers',
  inventory: 'Inventory',
  udhaar: 'Udhaar',
  analytics: 'Analytics',
  chat: 'AI Chat',
  settings: 'Settings',
  'crop-calendar': 'Crop Calendar',
};

export default function TopBar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  // Breadcrumb
  const pathnames = location.pathname.split('/').filter(x => x);
  const lastSegment = pathnames[pathnames.length - 1];
  const currentPage = BREADCRUMB_LABELS[lastSegment] || 'Dashboard';
  const isDealer = user?.role === 'dealer';

  return (
    <header className="h-[60px] bg-offwhite border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 font-ui transition-colors duration-300">
      
      {/* Left: Breadcrumbs + Role */}
      <div className="flex items-center gap-3 text-[13px] md:text-sm font-medium shrink-0">
        <span className="text-muted hidden md:inline">Prithvix</span>
        <span className="text-muted hidden md:inline mx-1">/</span>
        <span className="text-dark capitalize">{currentPage}</span>
        
        {/* Role Indicator */}
        <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
          isDealer 
            ? 'bg-gold/15 text-gold border border-gold/20' 
            : 'bg-forest/10 text-forest border border-forest/20'
        }`}>
          {isDealer ? <Briefcase size={9} /> : <ShieldCheck size={9} />}
          {user?.role}
        </span>
      </div>

      {/* Center/Right Container */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        
        {/* Search Bar */}
        <div className="relative hidden sm:block max-w-xs w-full lg:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-muted" />
          </div>
          <input 
            type="text" 
            placeholder="Search farmers, products..." 
            className="block w-full pl-9 pr-3 py-1.5 border border-border rounded-lg text-sm bg-surface focus:bg-panel focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors text-dark placeholder:text-muted"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-muted hover:text-dark hover:bg-surface rounded-lg transition-colors hidden md:flex items-center justify-center"
          >
            {isDark 
              ? <Sun size={17} className="text-gold" /> 
              : <Moon size={17} />
            }
          </button>
          
          {/* Notifications */}
          <button className="p-2 text-muted hover:text-dark hover:bg-surface rounded-lg transition-colors relative">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User Avatar (mobile) */}
          <div className="md:hidden flex items-center ml-1">
            <div className="w-7 h-7 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
