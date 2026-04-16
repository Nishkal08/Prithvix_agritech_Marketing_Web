import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, MessageSquare, MoreHorizontal } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard', exact: true },
  { icon: Users, label: 'Farmers', path: '/dashboard/farmers' },
  { icon: CreditCard, label: 'Udhaar', path: '/dashboard/udhaar' },
  { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0E1A14] border-t border-forest/30 md:hidden z-50 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          end={item.exact}
          className={({ isActive }) => `
            flex-1 flex flex-col items-center justify-center gap-1 transition-colors
            ${isActive ? 'text-gold' : 'text-muted hover:text-offwhite'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} className={`${isActive ? 'fill-gold/10' : ''}`} />
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
      
      {/* More / Settings tab dummy */}
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) => `
          flex-1 flex flex-col items-center justify-center gap-1 transition-colors
          ${isActive ? 'text-gold' : 'text-muted hover:text-offwhite'}
        `}
      >
        <MoreHorizontal size={22} />
      </NavLink>
    </nav>
  );
}
