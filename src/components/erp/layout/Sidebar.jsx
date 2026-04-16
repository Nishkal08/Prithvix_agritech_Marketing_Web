import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, CreditCard, 
  BarChart2, MessageSquare, Settings, LogOut, 
  ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';
import { DashboardContext } from '../../../context/DashboardContext';
import { AuthContext } from '../../../context/AuthContext';
import { useRole } from '../../../context/RoleContext';
import Logo from '../../ui/Logo';

const ALL_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard',              exact: true,     roles: ['dealer', 'staff'] },
  { icon: Users,           label: 'Farmers',       path: '/dashboard/farmers',                       roles: ['dealer', 'staff'] },
  { icon: Package,         label: 'Inventory',     path: '/dashboard/inventory',                     roles: ['dealer', 'staff'] },
  { icon: CreditCard,      label: 'Udhaar',        path: '/dashboard/udhaar',                        roles: ['dealer'] },
  { icon: BarChart2,       label: 'Analytics',     path: '/dashboard/analytics',                     roles: ['dealer', 'staff'] },
  { icon: CalendarDays,    label: 'Crop Calendar', path: '/dashboard/crop-calendar',                 roles: ['dealer', 'staff'] },
  { icon: MessageSquare,   label: 'AI Chat',       path: '/dashboard/chat',                          roles: ['dealer', 'staff'] },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useContext(DashboardContext);
  const { user, logout } = useContext(AuthContext);
  const role = useRole();

  const width = isCollapsed ? 'w-[64px]' : 'w-[256px]';
  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(user?.role || 'dealer'));

  return (
    <>
      {/* Spacer for fixed positioning on Desktop */}
      <div className={`hidden md:block shrink-0 transition-all duration-250 ease-out ${width}`} />

      <aside 
        className={`hidden md:flex fixed top-0 left-0 bottom-0 bg-[#0A1510] text-[#6B7C6E] flex-col border-r border-[#1F3028] transition-all duration-250 ease-out z-40 ${width}`}
      >
        {/* Logo Area */}
        <div className="h-[60px] flex items-center px-4 relative shrink-0 border-b border-[#1F3028]">
          <div className="overflow-hidden whitespace-nowrap flex items-center">
            {isCollapsed ? (
              <span className="text-gold font-bold text-lg">P</span>
            ) : (
              <Logo variant="light" className="h-6 w-auto" />
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1A3C2B] rounded-full flex items-center justify-center text-gold border border-[#1F3028] hover:bg-forest/80 transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
              user?.role === 'dealer' 
                ? 'bg-gold/20 text-gold' 
                : 'bg-[#2B3B30]/60 text-[#9BA89E]'
            }`}>
              {user?.role || 'DEALER'}
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center h-[40px] rounded-lg transition-all group relative
                ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                ${isActive 
                  ? 'bg-[#1A3C2B] text-offwhite' 
                  : 'hover:bg-[#13271C] hover:text-[#C8D5CB] border-transparent'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-[#4A6352] group-hover:text-[#8FAF9B]'}`} />
                  <span 
                    className={`ml-3 font-medium text-[13px] whitespace-nowrap transition-all duration-200 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 w-auto'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-[#1F3028] shrink-0">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => `
              flex items-center h-[40px] rounded-lg transition-all group mb-2
              ${isCollapsed ? 'justify-center px-0' : 'px-3'}
              ${isActive ? 'bg-[#1A3C2B] text-offwhite' : 'hover:bg-[#13271C] hover:text-[#C8D5CB]'}
            `}
            title={isCollapsed ? 'Settings' : undefined}
          >
            {({ isActive }) => (
              <>
                <Settings size={18} className={`shrink-0 ${isActive ? 'text-gold' : 'text-[#4A6352] group-hover:text-[#8FAF9B]'}`} />
                <span className={`ml-3 font-medium text-[13px] whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 w-auto'}`}>
                  Settings
                </span>
              </>
            )}
          </NavLink>

          <div className={`flex items-center p-2 rounded-lg bg-[#13271C] mt-1 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#1A3C2B] text-gold flex items-center justify-center text-xs font-bold shrink-0 ring-1 ring-gold/30">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#E8EDE9] truncate">{user?.name}</p>
                  <p className="text-[10px] text-gold/80 uppercase tracking-wider">{user?.role}</p>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button onClick={logout} className="p-1.5 text-[#4A6352] hover:text-[#D44A4A] hover:bg-[#2B1A1A] rounded-md transition-colors" title="Logout">
                <LogOut size={15} />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button onClick={logout} className="w-full flex justify-center mt-2 p-2 text-[#4A6352] hover:text-[#D44A4A] transition-colors" title="Logout">
              <LogOut size={17} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
