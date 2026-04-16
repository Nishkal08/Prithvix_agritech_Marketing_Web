import { useState, useContext } from 'react';
import { Check, Lock } from 'lucide-react';
import PageTransition from '../ui/PageTransition';
import { AuthContext } from '../../../context/AuthContext';
import { useRole } from '../../../context/RoleContext';
import { staff as initialStaff } from '../../../data/erp/staff';
import StatusBadge from '../ui/StatusBadge';
import FarmerAvatar from '../ui/FarmerAvatar';

const STATES = ['Gujarat', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Madhya Pradesh'];

function RestrictedTab({ label }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center">
        <Lock size={20} className="text-gold" />
      </div>
      <div>
        <p className="font-semibold text-dark">{label}</p>
        <p className="text-sm text-muted mt-1">This section is only accessible to the Dealer account.</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user }                       = useContext(AuthContext);
  const role                           = useRole();
  const isDealer                       = role?.can('settings.billing');
  const [staff, setStaff]              = useState(initialStaff);
  const [profileSaved, setProfileSaved] = useState(false);

  // Tabs — staff only sees Profile
  const TABS = isDealer
    ? ['Profile', 'Subscription', 'Staff & Permissions']
    : ['Profile'];
  const [activeTab, setActiveTab] = useState('Profile');

  const [profile, setProfile] = useState({
    shopName:  'Patel Agri Store',
    ownerName: user?.name || '',
    mobile:    '+91 98765 00000',
    email:     user?.email || user?.username || 'demo@prithvix.com',
    state:     'Gujarat',
    district:  'Vadodara',
    gst:       '24ABCDE1234F1Z5',
    address:   'Near Main Market, Anand Road, Vadodara',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <PageTransition>
      <div className="space-y-5 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-dark">Settings</h1>

        {/* Tabs */}
        <div className="flex border-b border-border gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab ? 'border-gold text-dark' : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <form onSubmit={handleSave} className="bg-panel border border-border rounded-xl p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="relative group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center text-xl font-bold">
                  {profile.ownerName.substring(0, 2).toUpperCase() || 'RP'}
                </div>
                <div className="absolute inset-0 rounded-full bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-offwhite font-semibold">
                  Change
                </div>
              </div>
              <div>
                <p className="font-semibold text-dark">{profile.ownerName}</p>
                <p className="text-sm text-muted">{profile.email}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 inline-block px-2 py-0.5 rounded-full ${
                  isDealer ? 'bg-gold/15 text-gold' : 'bg-forest/10 text-forest'
                }`}>{user?.role}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Shop Name',   key: 'shopName',  type: 'text',  restricted: false },
                { label: 'Owner Name',  key: 'ownerName', type: 'text',  restricted: false },
                { label: 'Mobile',      key: 'mobile',    type: 'tel',   restricted: false },
                { label: 'Email',       key: 'email',     type: 'email', restricted: false },
                { label: 'GST Number',  key: 'gst',       type: 'text',  restricted: !isDealer },
              ].map(({ label, key, type, restricted }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={profile[key]}
                    readOnly={restricted}
                    onChange={(e) => !restricted && setProfile(p => ({ ...p, [key]: e.target.value }))}
                    className={`w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-gold/50 text-dark ${
                      restricted ? 'opacity-50 cursor-not-allowed' : 'focus:bg-panel'
                    }`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">State</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile(p => ({ ...p, state: e.target.value }))}
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 bg-surface text-dark"
                >
                  {STATES.map(s => <option key={s} value={s} className="bg-panel">{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Shop Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))}
                rows={2}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none bg-surface text-dark focus:bg-panel"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gold text-dark font-semibold px-6 py-2.5 rounded-xl hover:bg-gold/90 transition-colors"
              >
                {profileSaved && <Check size={16} className="text-forest" />}
                {profileSaved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Subscription Tab — Dealer only */}
        {activeTab === 'Subscription' && (
          isDealer ? (
            <div className="space-y-4">
              <div className="bg-panel border border-border rounded-xl p-6 border-l-[4px] border-l-gold">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-full">Current Plan</span>
                    <h2 className="font-display font-bold text-2xl text-dark mt-2">Basic</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">Renews on</p>
                    <p className="font-semibold text-dark">15 May 2025</p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  {['Up to 500 farmers', '5 staff accounts', 'Udhaar tracking', 'Basic analytics', 'Email support'].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-dark">
                      <div className="w-5 h-5 rounded-full bg-forest/15 flex items-center justify-center">
                        <Check size={12} className="text-forest" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <button className="w-full bg-forest text-offwhite font-semibold py-3 rounded-xl hover:bg-forest/90 transition-colors">
                  Upgrade to Premium →
                </button>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-semibold text-dark mb-3">What's in Premium?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Unlimited farmers', 'AI Agronomist', 'Leaflet Map', 'Priority support', 'Custom QR cards', 'API access'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted">
                      <span className="text-gold">✦</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <RestrictedTab label="Subscription & Billing" />
          )
        )}

        {/* Staff Tab — Dealer only */}
        {activeTab === 'Staff & Permissions' && (
          isDealer ? (
            <div className="bg-panel border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-base text-dark">Staff Members</h2>
                <button className="text-sm bg-gold text-dark font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors">
                  + Add Staff
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    {['Name', 'Role', 'Mobile', 'Status', 'Actions'].map(h => (
                      <th key={h} scope="col" className="px-4 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, i) => (
                    <tr key={s.id} className={`border-b border-border/40 last:border-0 ${i % 2 === 1 ? 'bg-surface/40' : ''}`} style={{ height: '52px' }}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <FarmerAvatar initials={s.avatar} size="sm" />
                          <span className="font-medium text-dark">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-muted">{s.role}</td>
                      <td className="px-4 py-2 font-mono text-muted text-xs">{s.mobile}</td>
                      <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-2">
                        <button className="text-xs text-muted hover:text-dark underline mr-3">Edit</button>
                        <button
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => setStaff(prev => prev.map(m => m.id === s.id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m))}
                        >
                          {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <RestrictedTab label="Staff & Permissions" />
          )
        )}
      </div>
    </PageTransition>
  );
}
