import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MapPin, CreditCard, Package, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import PageTransition from '../ui/PageTransition';
import KPICard from '../ui/KPICard';
import AlertBanner from '../ui/AlertBanner';
import { useRole } from '../../../context/RoleContext';
import { AuthContext } from '../../../context/AuthContext';
import { analytics } from '../../../data/erp/analytics';
import { recentActivity } from '../../../data/erp/orders';

const ACTIVITY_ICON_MAP = {
  UserPlus:   { Icon: UserPlus,   bg: 'bg-forest/10', color: 'text-forest' },
  MapPin:     { Icon: MapPin,     bg: 'bg-blue-500/10', color: 'text-blue-400' },
  CreditCard: { Icon: CreditCard, bg: 'bg-purple-500/10', color: 'text-purple-400' },
  Package:    { Icon: Package,    bg: 'bg-gold/10', color: 'text-gold' },
};

const sparklineData7d = [
  { v: 18000 }, { v: 24000 }, { v: 32000 }, { v: 28000 }, { v: 42000 }, { v: 38000 }, { v: 46000 },
];
const sparklineGrowth = [
  { v: 120 }, { v: 135 }, { v: 148 }, { v: 162 }, { v: 180 }, { v: 210 }, { v: 262 },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const role = useRole();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const overdueCount = 3;
  const isDealer = role?.can('dashboard.revenue');

  // Filter KPIs by role — staff doesn't see financial KPIs
  const visibleKPIs = isDealer
    ? analytics.kpis
    : analytics.kpis.filter(k => !['Total Revenue', 'Collection Rate'].includes(k.label));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Dashboard</h1>
          <p className="text-muted text-sm mt-1">{greeting}, {user?.name?.split(' ')[0]} — here's what's happening today.</p>
        </div>

        {/* Alert Banner — only dealer sees overdue credit alerts */}
        {isDealer && (
          <AlertBanner count={overdueCount} onViewOverdue={() => navigate('/dashboard/udhaar')} />
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {visibleKPIs.map((kpi) => (
            <KPICard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              iconName={kpi.icon}
              delta={kpi.delta}
              trend={kpi.trend}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard/farmers')}
            className="flex items-center gap-2 bg-gold text-dark text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gold/90 transition-colors"
          >
            <UserPlus size={16} /> Register Farmer
          </button>
          <button className="flex items-center gap-2 bg-panel border border-border text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-surface transition-colors">
            <MapPin size={16} /> Log Visit
          </button>
          {/* Only dealers can record payments */}
          {isDealer && (
            <button className="flex items-center gap-2 bg-panel border border-border text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-surface transition-colors">
              <CreditCard size={16} /> Record Payment
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/inventory')}
            className="flex items-center gap-2 bg-panel border border-border text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-surface transition-colors"
          >
            <Package size={16} /> Add Product
          </button>
        </div>

        {/* Bottom Row: Activity + Sparklines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-panel border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-base text-dark">Recent Activity</h2>
            </div>
            <div className="overflow-y-auto max-h-[360px] custom-scrollbar">
              {recentActivity.map((item) => {
                const { Icon, bg, color } = ACTIVITY_ICON_MAP[item.type] || ACTIVITY_ICON_MAP.Package;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark truncate">{item.action}</p>
                      <p className="text-[12px] text-muted mt-0.5">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                    </div>
                    <span className="text-[11px] font-semibold bg-surface text-muted px-2 py-1 rounded-full shrink-0">{item.context}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sparkline Cards — dealer only */}
          {isDealer ? (
            <div className="flex flex-col gap-4">
              {/* Revenue Sparkline */}
              <div className="bg-panel border border-border rounded-xl p-5 flex-1">
                <p className="text-[12px] text-muted font-medium mb-1">Revenue — last 7 days</p>
                <p className="font-display font-bold text-2xl text-dark mb-3">₹2,84,000</p>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={sparklineData7d} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#D4A853" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#D4A853" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgb(var(--color-panel))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px', fontSize: '12px', color: 'rgb(var(--color-dark))' }}
                      formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                      labelFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Farmer Growth Sparkline */}
              <div className="bg-panel border border-border rounded-xl p-5 flex-1">
                <p className="text-[12px] text-muted font-medium mb-1">New Farmers — 30 days</p>
                <p className="font-display font-bold text-2xl text-dark mb-3">142</p>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={sparklineGrowth} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="growGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1A3C2B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1A3C2B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#1A3C2B" strokeWidth={2} fill="url(#growGrad)" dot={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgb(var(--color-panel))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px', fontSize: '12px', color: 'rgb(var(--color-dark))' }}
                      formatter={(v) => [v, 'Farmers']}
                      labelFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            /* Staff sees a summary highlight card instead */
            <div className="bg-forest/10 border border-forest/20 rounded-xl p-5 flex flex-col justify-center items-center text-center gap-3">
              <TrendingUp size={32} className="text-gold" />
              <div>
                <p className="font-display font-semibold text-dark text-base">Good Progress!</p>
                <p className="text-muted text-sm mt-1">142 farmers registered this month. Keep up the great work!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
