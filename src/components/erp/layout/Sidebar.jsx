import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, CreditCard, 
  BarChart2, MessageSquare, Settings, LogOut, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { DashboardContext } from '../../../context/DashboardContext';
import { AuthContext } from '../../../context/AuthContext';
import Logo from '../../ui/Logo';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', exact: true },
  { icon: Users, label: 'Farmers', path: '/dashboard/farmers' },
  { icon: Package, label: 'Inventory', path: '/dashboard/inventory' },
  { icon: CreditCard, label: 'Udhaar', path: '/dashboard/udhaar' },
  { icon: BarChart2, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: MessageSquare, label: 'AI Chat', path: '/dashboard/chat' },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useContext(DashboardContext);
  const { user, logout } = useContext(AuthContext);

  const width = isCollapsed ? 'w-[64px]' : 'w-[256px]';

  return (
    <>
      {/* Spacer for fixed positioning on Desktop */}
      <div className={`hidden md:block shrink-0 transition-all duration-250 ease-out ${width}`} />

      <aside 
        className={`hidden md:flex fixed top-0 left-0 bottom-0 bg-[#0E1A14] text-[#6B7C6E] flex-col border-r border-forest/30 transition-all duration-250 ease-out z-40 ${width}`}
      >
        {/* Logo Area */}
        <div className="h-[60px] flex items-center px-4 relative shrink-0">
          <div className="overflow-hidden whitespace-nowrap flex items-center">
            {isCollapsed ? (
              <img src="/leaf-solo.svg" alt="Logo" className="w-8 h-8 opacity-0" /> // Pseudo hide if no icon logo
            ) : (
              <Logo variant="light" className="h-6 w-auto" />
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-forest rounded-full flex items-center justify-center text-gold border border-dark hover:bg-forest/80 transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center h-[44px] rounded-lg transition-colors group relative
                ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                ${isActive ? 'bg-forest text-offwhite border-l-[3px] border-gold' : 'hover:bg-forest/40 hover:text-offwhite border-l-[3px] border-transparent'}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={`shrink-0 ${isActive ? 'text-gold' : 'text-[#4A6352] group-hover:text-gold'}`} />
                  <span 
                    className={`ml-3 font-medium text-[14px] whitespace-nowrap transition-all duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 w-auto'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-forest/30 shrink-0">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `
              flex items-center h-[44px] rounded-lg transition-colors group mb-2
              ${isCollapsed ? 'justify-center px-0' : 'px-3'}
              ${isActive ? 'bg-forest text-offwhite border-l-[3px] border-gold' : 'hover:bg-forest/40 hover:text-offwhite border-l-[3px] border-transparent'}
            `}
            title={isCollapsed ? 'Settings' : undefined}
          >
            {({ isActive }) => (
              <>
                <Settings size={20} className={`shrink-0 ${isActive ? 'text-gold' : 'text-[#4A6352] group-hover:text-gold'}`} />
                <span className={`ml-3 font-medium text-[14px] whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 w-auto'}`}>
                  Settings
                </span>
              </>
            )}
          </NavLink>

          <div className={`flex items-center p-2 rounded-lg bg-forest/20 mt-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-offwhite truncate">{user?.name}</p>
                  <p className="text-[10px] text-gold uppercase tracking-wider">{user?.role}</p>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button onClick={logout} className="p-1.5 text-[#6B7C6E] hover:text-offwhite hover:bg-forest/50 rounded-md transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Logout button for collapsed view */}
          {isCollapsed && (
            <button onClick={logout} className="w-full flex justify-center mt-2 p-2 text-[#6B7C6E] hover:text-[#D44A4A] transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
