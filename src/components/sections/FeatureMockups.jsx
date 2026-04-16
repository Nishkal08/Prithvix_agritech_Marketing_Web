import { User, MapPin, CreditCard, Package, BarChart3, MessageSquare, QrCode, Camera, Bell, ArrowUp, ArrowDown, Search, Leaf, Star, Send } from 'lucide-react';

/* Each mockup simulates a real mobile app screen */

export function FarmerCardMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">Farmer Profile</h3>
        <QrCode size={18} className="text-gold" />
      </div>
      {/* QR Card preview */}
      <div className="bg-forest rounded-xl p-4 text-offwhite">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <User size={18} className="text-gold" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">Raju Sharma</p>
            <p className="text-[11px] text-offwhite/60">ID: PRX-2847</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div><span className="text-offwhite/50">Crop</span><p className="font-medium">Wheat, Mustard</p></div>
          <div><span className="text-offwhite/50">Village</span><p className="font-medium">Karjat</p></div>
          <div><span className="text-offwhite/50">Credit Limit</span><p className="font-medium text-gold">₹15,000</p></div>
          <div><span className="text-offwhite/50">Visits</span><p className="font-medium">12</p></div>
        </div>
      </div>
      {/* Recent farmers list */}
      <p className="font-body text-[11px] text-muted font-medium uppercase tracking-wider">Recent</p>
      {['Sunil Yadav', 'Preeti Devi', 'Mohan Lal'].map((name, i) => (
        <div key={name} className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-[10px] font-display font-semibold text-forest">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-body text-xs text-dark">{name}</span>
          </div>
          <span className="text-[10px] text-muted">{3 + i} crops</span>
        </div>
      ))}
    </div>
  );
}

export function FieldVisitMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">Field Visit</h3>
        <Camera size={18} className="text-forest" />
      </div>
      {/* Visit card */}
      <div className="bg-surface rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={14} className="text-gold" />
          <span className="font-body text-xs text-dark font-medium">Ratnagiri, Maharashtra</span>
        </div>
        <p className="font-body text-[11px] text-muted">Apr 12, 2025 · Grape vineyard</p>
        <div className="mt-2 bg-offwhite rounded p-2">
          <p className="font-body text-[11px] text-dark font-medium">🌿 AI Recommendation</p>
          <p className="font-body text-[10px] text-muted mt-1">Powdery mildew detected. Apply Sulphur 80% WP @ 2g/L. Repeat after 10 days.</p>
        </div>
      </div>
      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {[1,2,3].map(i => (
          <div key={i} className="aspect-square bg-surface rounded flex items-center justify-center">
            <Leaf size={16} className="text-muted/30" />
          </div>
        ))}
      </div>
      {/* Notes */}
      <div className="bg-surface/50 rounded-lg p-2.5">
        <p className="font-body text-[11px] text-dark font-medium">Notes</p>
        <p className="font-body text-[10px] text-muted mt-1">Farmer reports yellowing leaves. Soil moisture level low. Recommended drip irrigation check.</p>
      </div>
    </div>
  );
}

export function UdhaarMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">Udhaar Ledger</h3>
        <CreditCard size={18} className="text-gold" />
      </div>
      {/* Summary card */}
      <div className="bg-dark rounded-xl p-4 text-offwhite">
        <p className="text-[11px] text-offwhite/50">Total Outstanding</p>
        <p className="font-display font-bold text-2xl text-gold mt-1">₹1,23,450</p>
        <div className="flex gap-4 mt-3 text-[11px]">
          <div><span className="text-offwhite/50">Recovered</span><p className="text-green-400 font-medium">₹89,200</p></div>
          <div><span className="text-offwhite/50">Overdue</span><p className="text-red-400 font-medium">₹34,250</p></div>
        </div>
      </div>
      {/* Transaction list */}
      {[
        { name: 'Raju Sharma', amount: '₹4,500', type: 'credit', date: 'Apr 10' },
        { name: 'Preeti Devi', amount: '₹2,000', type: 'payment', date: 'Apr 9' },
        { name: 'Mohan Lal', amount: '₹7,800', type: 'credit', date: 'Apr 8' },
      ].map((tx) => (
        <div key={tx.name + tx.date} className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            {tx.type === 'credit' ?
              <ArrowUp size={14} className="text-red-400" /> :
              <ArrowDown size={14} className="text-green-500" />
            }
            <div>
              <p className="font-body text-xs text-dark font-medium">{tx.name}</p>
              <p className="text-[10px] text-muted">{tx.date}</p>
            </div>
          </div>
          <span className={`font-display text-xs font-semibold ${tx.type === 'credit' ? 'text-red-400' : 'text-green-500'}`}>
            {tx.type === 'credit' ? '-' : '+'}{tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InventoryMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">Inventory</h3>
        <Search size={18} className="text-muted" />
      </div>
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
        <Search size={14} className="text-muted" />
        <span className="font-body text-xs text-muted">Search products...</span>
      </div>
      {/* Stock alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start gap-2">
        <Bell size={14} className="text-red-500 mt-0.5" />
        <div>
          <p className="font-body text-[11px] text-red-700 font-medium">3 items low on stock</p>
          <p className="font-body text-[10px] text-red-500">Restock before peak season</p>
        </div>
      </div>
      {/* Product list */}
      {[
        { name: 'NPK 10-26-26', qty: 12, unit: 'bags', status: 'ok' },
        { name: 'Imidacloprid 17.8%', qty: 3, unit: 'L', status: 'low' },
        { name: 'Sulphur 80% WP', qty: 24, unit: 'kg', status: 'ok' },
        { name: 'Wheat Seeds (HD-2967)', qty: 2, unit: 'bags', status: 'low' },
      ].map((item) => (
        <div key={item.name} className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-forest" />
            <span className="font-body text-xs text-dark">{item.name}</span>
          </div>
          <span className={`font-body text-[11px] font-medium ${item.status === 'low' ? 'text-red-500' : 'text-forest'}`}>
            {item.qty} {item.unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsMockup() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">Analytics</h3>
        <BarChart3 size={18} className="text-forest" />
      </div>
      {/* Revenue card */}
      <div className="bg-forest rounded-xl p-4 text-offwhite">
        <p className="text-[11px] text-offwhite/50">This Month Revenue</p>
        <p className="font-display font-bold text-xl text-gold mt-1">₹4,56,780</p>
        <p className="text-[10px] text-green-400 mt-1">↑ 18% from last month</p>
      </div>
      {/* Mini bar chart */}
      <div className="bg-surface rounded-lg p-3">
        <p className="font-body text-[11px] text-dark font-medium mb-2">Weekly Sales</p>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                backgroundColor: i === 5 ? '#D4A853' : '#1A3C2B',
                opacity: i === 5 ? 1 : 0.6,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-muted mt-1">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface rounded-lg p-2.5 text-center">
          <p className="font-display font-bold text-lg text-forest">234</p>
          <p className="text-[10px] text-muted">Active Farmers</p>
        </div>
        <div className="bg-surface rounded-lg p-2.5 text-center">
          <p className="font-display font-bold text-lg text-gold">92%</p>
          <p className="text-[10px] text-muted">Collection Rate</p>
        </div>
      </div>
    </div>
  );
}

export function AIChatMockup() {
  return (
    <div className="space-y-3 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-dark">AI Agronomist</h3>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-muted">Online</span>
        </div>
      </div>
      {/* Language selector */}
      <div className="flex gap-1.5">
        {['EN', 'हिं', 'मरा', 'गुज', 'राज'].map((lang, i) => (
          <span
            key={lang}
            className={`px-2 py-0.5 rounded text-[10px] font-body ${
              i === 0 ? 'bg-forest text-offwhite' : 'bg-surface text-muted'
            }`}
          >
            {lang}
          </span>
        ))}
      </div>
      {/* Chat messages */}
      <div className="flex-1 space-y-2.5 overflow-hidden">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-forest text-offwhite rounded-xl rounded-br-sm px-3 py-2 max-w-[85%]">
            <p className="text-[11px]">What fertilizer for tomato flowering stage?</p>
          </div>
        </div>
        {/* AI response */}
        <div className="flex justify-start">
          <div className="bg-surface text-dark rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%]">
            <div className="flex items-center gap-1 mb-1">
              <Star size={10} className="text-gold" />
              <span className="text-[10px] text-muted font-medium">AI Agronomist</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              For tomato flowering, apply <span className="font-medium text-forest">NPK 19-19-19</span> at 5g/L
              via foliar spray. Also add <span className="font-medium text-forest">Boron 20%</span> at 1g/L
              for better fruit setting.
            </p>
          </div>
        </div>
        {/* User follow up */}
        <div className="flex justify-end">
          <div className="bg-forest text-offwhite rounded-xl rounded-br-sm px-3 py-2 max-w-[85%]">
            <p className="text-[11px]">What about calcium deficiency?</p>
          </div>
        </div>
      </div>
      {/* Input bar */}
      <div className="flex items-center gap-2 bg-surface rounded-full px-3 py-2">
        <span className="font-body text-[11px] text-muted flex-1">Ask anything about crops...</span>
        <Send size={14} className="text-forest" />
      </div>
    </div>
  );
}
