import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

export default function TopBar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Simple breadcrumb generation
  const pathnames = location.pathname.split('/').filter(x => x);
  const currentPath = pathnames.length > 1 
    ? pathnames[pathnames.length - 1].replace('-', ' ') 
    : 'Home';

  return (
    <header className="h-[60px] bg-white border-b border-[#E8E3DA] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 font-ui transition-colors">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center text-[13px] md:text-sm font-medium shrink-0">
        <span className="text-muted hidden md:inline">Prithvix</span>
        <span className="text-muted hidden md:inline mx-2">/</span>
        <span className="text-dark capitalize">{currentPath}</span>
      </div>

      {/* Center/Right Container */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        
        {/* Search Bar - hidden on very small screens */}
        <div className="relative hidden sm:block max-w-xs w-full lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted" />
          </div>
          <input 
            type="text" 
            placeholder="Search farmers, products..." 
            className="block w-full pl-10 pr-3 py-1.5 border border-[#E8E3DA] rounded-lg text-sm bg-offwhite focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors text-dark"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 border-l border-[#E8E3DA] pl-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-secondary hover:text-dark hover:bg-offwhite rounded-full transition-colors hidden md:block"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Notifications */}
          <button className="p-2 text-secondary hover:text-dark hover:bg-offwhite rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D44A4A] rounded-full border border-white" />
          </button>

          {/* User Mobile Profile (hidden on desktop since it's in sidebar) */}
          <div className="md:hidden flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
        
      </div>
    </header>
  );
}
