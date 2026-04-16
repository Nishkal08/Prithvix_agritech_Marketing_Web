import { useState } from 'react';
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { Lock } from 'lucide-react';
import PageTransition from '../ui/PageTransition';
import { useRole } from '../../../context/RoleContext';
import { analytics } from '../../../data/erp/analytics';
import FarmerMap from '../ui/FarmerMap';

const RANGE_TABS = ['Today', 'This Week', 'This Month', 'All Time'];
const RANGE_KEYS = { 'Today': 'today', 'This Week': 'thisWeek', 'This Month': 'thisMonth', 'All Time': 'allTime' };
const DAY_KEY    = { 'today': 'time', 'thisWeek': 'day', 'thisMonth': 'week', 'allTime': 'month' };

const TOOLTIP_STYLE = {
  background: 'rgb(var(--color-panel))',
  border: '1px solid rgb(var(--color-border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'rgb(var(--color-dark))',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-panel border border-border rounded-lg px-4 py-2.5 shadow-lg text-sm">
      <p className="text-muted text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-dark">
        {typeof payload[0].value === 'number' && payload[0].value > 1000
          ? `₹${payload[0].value.toLocaleString('en-IN')}`
          : payload[0].value}
      </p>
    </div>
  );
};

/** Shown to Staff instead of financial charts */
function RestrictedSection({ title }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
      <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
        <Lock size={18} className="text-gold" />
      </div>
      <div>
        <p className="font-semibold text-dark text-sm">{title}</p>
        <p className="text-xs text-muted mt-1">Financial data is only visible to Dealers.</p>
      </div>
    </div>
  );
}

function RevenueChart({ data, xKey }) {
  const [chartType, setChartType] = useState('bar');
  return (
    <div className="bg-panel border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-base text-dark">Revenue</h3>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {['bar', 'line'].map(t => (
            <button key={t} onClick={() => setChartType(t)}
              className={`text-xs px-3 py-1 rounded font-medium capitalize transition-colors ${chartType === t ? 'bg-panel text-dark shadow-sm' : 'text-muted hover:text-dark'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.6)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          {chartType === 'bar'
            ? <Bar dataKey="value" fill="#1A3C2B" radius={[4, 4, 0, 0]} />
            : <Line type="monotone" dataKey="value" stroke="#D4A853" strokeWidth={2.5} dot={{ fill: '#D4A853', r: 3 }} />
          }
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function FarmerGrowthChart({ data }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-5">
      <h3 className="font-display font-semibold text-base text-dark mb-4">Farmer Growth</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="growGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1A3C2B" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#1A3C2B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.6)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="count" stroke="#D4A853" strokeWidth={2} fill="url(#growGrad2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CollectionDonut({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const collected = data[0]?.value || 0;
  const pct = Math.round((collected / total) * 100);
  return (
    <div className="bg-panel border border-border rounded-xl p-5">
      <h3 className="font-display font-semibold text-base text-dark mb-4">Collection Rate</h3>
      <div className="flex items-center gap-6">
        <div className="relative">
          <PieChart width={140} height={140}>
            <Pie data={data} cx={65} cy={65} innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="font-display font-bold text-2xl text-dark">{pct}%</span>
            <span className="text-[10px] text-muted">collected</span>
          </div>
        </div>
        <div className="space-y-3">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <div>
                <p className="text-xs font-medium text-dark">{d.name}</p>
                <p className="text-xs text-muted">₹{d.value.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryBreakdownChart({ data }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-5">
      <h3 className="font-display font-semibold text-base text-dark mb-4">Inventory Breakdown</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.6)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: 'rgb(var(--color-muted))' }} axisLine={false} tickLine={false} width={70} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" fill="#1A3C2B" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Analytics() {
  const [activeRange, setActiveRange] = useState('This Week');
  const [mapView, setMapView] = useState('cluster');
  const role = useRole();
  const canSeeFinancials = role?.can('analytics.financial');

  const rangeKey   = RANGE_KEYS[activeRange];
  const revenueData = analytics.revenueData[rangeKey];
  const xKey       = DAY_KEY[rangeKey];

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display font-bold text-2xl text-dark">Analytics</h1>
          {/* Date Range Tabs */}
          <div className="flex gap-1 bg-panel border border-border rounded-xl p-1">
            {RANGE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveRange(tab)}
                className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeRange === tab ? 'bg-dark text-offwhite' : 'text-muted hover:text-dark hover:bg-surface'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue — Dealer only */}
          {canSeeFinancials
            ? <RevenueChart data={revenueData} xKey={xKey} />
            : <RestrictedSection title="Revenue Analytics" />
          }
          {/* Farmer Growth — All roles */}
          <FarmerGrowthChart data={analytics.farmerGrowth} />
          {/* Collection Rate — Dealer only */}
          {canSeeFinancials
            ? <CollectionDonut data={analytics.collectionData} />
            : <RestrictedSection title="Collection Rate" />
          }
          {/* Inventory — All roles */}
          <InventoryBreakdownChart data={analytics.inventoryBreakdown} />
        </div>

        {/* Farmer Distribution Map — All roles */}
        <div className="bg-panel border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-base text-dark">Farmer Distribution & Udhaar Density</h3>
            <div className="flex gap-2">
              {['cluster', 'heat'].map(v => (
                <button key={v}
                  onClick={() => setMapView(v)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors border capitalize ${
                    mapView === v ? 'bg-forest text-gold border-forest' : 'bg-panel text-muted border-border'
                  }`}>
                  {v === 'cluster' ? 'Clusters' : 'Heatmap'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px]">
            <FarmerMap view={mapView} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
