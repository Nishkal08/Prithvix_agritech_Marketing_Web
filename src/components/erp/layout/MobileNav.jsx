import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, MessageSquare, CalendarDays, MoreHorizontal } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

const ALL_MOBILE_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home',     path: '/dashboard',          exact: true, roles: ['dealer', 'staff'] },
  { icon: Users,           label: 'Farmers',  path: '/dashboard/farmers',               roles: ['dealer', 'staff'] },
  { icon: CalendarDays,    label: 'Calendar', path: '/dashboard/crop-calendar',         roles: ['dealer', 'staff'] },
  { icon: CreditCard,      label: 'Udhaar',   path: '/dashboard/udhaar',                roles: ['dealer'] },
  { icon: MessageSquare,   label: 'Chat',     path: '/dashboard/chat',                  roles: ['dealer', 'staff'] },
];

export default function MobileNav() {
  const { user } = useContext(AuthContext);
  const visibleItems = ALL_MOBILE_NAV_ITEMS.filter(item => item.roles.includes(user?.role || 'dealer'));

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A1510] border-t border-[#1F3028] md:hidden z-50 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {visibleItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          end={item.exact}
          className={({ isActive }) => `
            flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
            ${isActive ? 'text-gold' : 'text-[#4A6352] hover:text-[#8FAF9B]'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} className={isActive ? 'fill-gold/10' : ''} />
              <span className={`text-[9px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {/* More / Settings */}
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) => `
          flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
          ${isActive ? 'text-gold' : 'text-[#4A6352] hover:text-[#8FAF9B]'}
        `}
      >
        <MoreHorizontal size={20} />
      </NavLink>
    </nav>
  );
}
