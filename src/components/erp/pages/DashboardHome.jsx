import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MapPin, CreditCard, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import PageTransition from '../ui/PageTransition';
import KPICard from '../ui/KPICard';
import AlertBanner from '../ui/AlertBanner';
import { analytics } from '../../../data/erp/analytics';
import { recentActivity } from '../../../data/erp/orders';

const ACTIVITY_ICON_MAP = {
  UserPlus:   { Icon: UserPlus,   bg: 'bg-[#D1E8DA]', color: 'text-[#1A3C2B]' },
  MapPin:     { Icon: MapPin,     bg: 'bg-[#D4E8F5]', color: 'text-[#1A3C7C]' },
  CreditCard: { Icon: CreditCard, bg: 'bg-[#E8DAF5]', color: 'text-[#3C1A7C]' },
  Package:    { Icon: Package,    bg: 'bg-[#F5ECD4]', color: 'text-[#7C5C1A]' },
};

const sparklineData7d = [
  { v: 18000 }, { v: 24000 }, { v: 32000 }, { v: 28000 }, { v: 42000 }, { v: 38000 }, { v: 46000 },
];
const sparklineGrowth = [
  { v: 120 }, { v: 135 }, { v: 148 }, { v: 162 }, { v: 180 }, { v: 210 }, { v: 262 },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const overdueCount = 3;

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Dashboard</h1>
          <p className="text-secondary text-sm mt-1">Good morning — here's what's happening today.</p>
        </div>

        {/* Alert Banner */}
        <AlertBanner count={overdueCount} onViewOverdue={() => navigate('/dashboard/udhaar')} />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {analytics.kpis.map((kpi) => (
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
          <button className="flex items-center gap-2 bg-white border border-[#E8E3DA] text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#F0EDE6] transition-colors">
            <MapPin size={16} /> Log Visit
          </button>
          <button className="flex items-center gap-2 bg-white border border-[#E8E3DA] text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#F0EDE6] transition-colors">
            <CreditCard size={16} /> Record Payment
          </button>
          <button
            onClick={() => navigate('/dashboard/inventory')}
            className="flex items-center gap-2 bg-white border border-[#E8E3DA] text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#F0EDE6] transition-colors"
          >
            <Package size={16} /> Add Product
          </button>
        </div>

        {/* Bottom Row: Activity + Sparklines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white border border-[#E8E3DA] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E3DA]">
              <h2 className="font-display font-semibold text-base text-dark">Recent Activity</h2>
            </div>
            <div className="overflow-y-auto max-h-[360px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D6CFC3 transparent' }}>
              {recentActivity.map((item) => {
                const { Icon, bg, color } = ACTIVITY_ICON_MAP[item.type] || ACTIVITY_ICON_MAP.Package;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F5F0E8] last:border-0 hover:bg-[#FAFAF8] transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark truncate">{item.action}</p>
                      <p className="text-[12px] text-muted mt-0.5">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                    </div>
                    <span className="text-[11px] font-semibold bg-[#EDE8DF] text-secondary px-2 py-1 rounded-full shrink-0">{item.context}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sparkline Cards */}
          <div className="flex flex-col gap-4">
            {/* Revenue Sparkline */}
            <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 flex-1">
              <p className="text-[12px] text-secondary font-medium mb-1">Revenue — last 7 days</p>
              <p className="font-display font-bold text-2xl text-dark mb-3">₹2,84,000</p>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={sparklineData7d} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#D4A853" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E8E3DA', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                    labelFormatter={() => ''}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Farmer Growth Sparkline */}
            <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 flex-1">
              <p className="text-[12px] text-secondary font-medium mb-1">New Farmers — 30 days</p>
              <p className="font-display font-bold text-2xl text-dark mb-3">142</p>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={sparklineGrowth} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="growGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3C2B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A3C2B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#1A3C2B" strokeWidth={2} fill="url(#growGrad)" dot={false} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E8E3DA', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v) => [v, 'Farmers']}
                    labelFormatter={() => ''}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
