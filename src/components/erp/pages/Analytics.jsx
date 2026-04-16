import { useState } from 'react';
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import PageTransition from '../ui/PageTransition';
import { analytics } from '../../../data/erp/analytics';
import FarmerMap from '../ui/FarmerMap';

const RANGE_TABS = ['Today', 'This Week', 'This Month', 'All Time'];
const RANGE_KEYS = { 'Today': 'today', 'This Week': 'thisWeek', 'This Month': 'thisMonth', 'All Time': 'allTime' };
const DAY_KEY = { 'today': 'time', 'thisWeek': 'day', 'thisMonth': 'week', 'allTime': 'month' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-secondary border border-subtle rounded-lg px-4 py-2.5 shadow-xl text-sm">
      <p className="text-secondary text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display font-bold text-primary text-base">{typeof payload[0].value === 'number' && payload[0].value > 1000 ? `₹${payload[0].value.toLocaleString('en-IN')}` : payload[0].value}</p>
    </div>
  );
};

function RevenueChart({ data, xKey }) {
  const [chartType, setChartType] = useState('bar');
  return (
    <div className="bg-secondary border border-subtle rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-sm text-primary uppercase tracking-tight">Revenue Analytics</h3>
        <div className="flex gap-1 bg-tertiary rounded-lg p-1 border border-subtle">
          {['bar', 'line'].map(t => (
            <button key={t} onClick={() => setChartType(t)}
              className={`text-[10px] px-3 py-1.5 rounded-md font-bold capitalize transition-all ${chartType === t ? 'bg-gold text-dark shadow-sm' : 'text-secondary hover:text-primary'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
          <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.4 }} />
          {chartType === 'bar'
            ? <Bar dataKey="value" fill="var(--color-forest)" radius={[4, 4, 0, 0]} />
            : <Line type="monotone" dataKey="value" stroke="var(--color-gold)" strokeWidth={3} dot={{ fill: 'var(--color-gold)', r: 4, strokeWidth: 2, stroke: 'var(--bg-secondary)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
          }
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function FarmerGrowthChart({ data }) {
  return (
    <div className="bg-secondary border border-subtle rounded-xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-sm text-primary mb-6 uppercase tracking-tight">Farmer Ecosystem Growth</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="growGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-forest)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-forest)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.5} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="count" stroke="var(--color-gold)" strokeWidth={3} fill="url(#growGrad2)" activeDot={{ r: 6, strokeWidth: 0 }} />
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
    <div className="bg-secondary border border-subtle rounded-xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-sm text-primary mb-6 uppercase tracking-tight">Collection Efficiency</h3>
      <div className="flex items-center justify-around gap-6 py-2">
        <div className="relative">
          <PieChart width={150} height={150}>
            <Pie data={data} cx={70} cy={70} innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={4} stroke="none">
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center flex-col translate-y-[-5px]">
            <span className="font-display font-bold text-3xl text-primary">{pct}%</span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Ratio</span>
          </div>
        </div>
        <div className="space-y-4">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-tight">{d.name}</p>
                <p className="text-[13px] font-mono text-secondary font-bold">₹{d.value.toLocaleString('en-IN')}</p>
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
    <div className="bg-secondary border border-subtle rounded-xl p-5 shadow-sm">
      <h3 className="font-display font-bold text-sm text-primary mb-6 uppercase tracking-tight">Inventory Distribution</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} opacity={0.5} />
          <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.4 }} />
          <Bar dataKey="value" fill="var(--color-gold)" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Analytics() {
  const [activeRange, setActiveRange] = useState('This Week');
  const [mapView, setMapView] = useState('cluster'); // 'cluster' or 'heat'
  const rangeKey = RANGE_KEYS[activeRange];
  const revenueData = analytics.revenueData[rangeKey];
  const xKey = DAY_KEY[rangeKey];

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display font-bold text-2xl text-primary">Intelligence Hub</h1>
          {/* Date Range Tabs */}
          <div className="flex gap-1 bg-secondary border border-subtle rounded-xl p-1 shadow-inner">
            {RANGE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveRange(tab)}
                className={`text-[11px] px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeRange === tab ? 'bg-gold text-dark shadow-sm' : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RevenueChart data={revenueData} xKey={xKey} />
          <FarmerGrowthChart data={analytics.farmerGrowth} />
          <CollectionDonut data={analytics.collectionData} />
          <InventoryBreakdownChart data={analytics.inventoryBreakdown} />
        </div>

        {/* Farmer Distrubution Map */}
        <div className="bg-secondary border border-subtle rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-tight">Farmer Distribution & Udhaar Density</h3>
            <div className="flex gap-2 bg-tertiary p-1 rounded-xl border border-subtle shadow-inner">
              <button 
                onClick={() => setMapView('cluster')}
                className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all ${
                  mapView === 'cluster' ? 'bg-gold text-dark shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                CLUSTERS
              </button>
              <button 
                onClick={() => setMapView('heat')}
                className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all ${
                  mapView === 'heat' ? 'bg-gold text-dark shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                HEATMAP
              </button>
            </div>
          </div>
          <div className="h-[450px] rounded-xl overflow-hidden border border-subtle shadow-inner">
            <FarmerMap view={mapView} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

