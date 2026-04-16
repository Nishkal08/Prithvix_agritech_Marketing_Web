import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import PageTransition from '../ui/PageTransition';
import { AuthContext } from '../../../context/AuthContext';
import { staff as initialStaff } from '../../../data/erp/staff';
import StatusBadge from '../ui/StatusBadge';
import FarmerAvatar from '../ui/FarmerAvatar';

const STATES = ['Gujarat', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Madhya Pradesh'];

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Profile');
  const [staff, setStaff] = useState(initialStaff);
  const [profileSaved, setProfileSaved] = useState(false);

  const [profile, setProfile] = useState({
    shopName: 'Patel Agri Store',
    ownerName: user?.name || '',
    mobile: '+91 98765 00000',
    email: 'demo@prithvix.com',
    state: 'Gujarat',
    district: 'Vadodara',
    gst: '24ABCDE1234F1Z5',
    address: 'Near Main Market, Anand Road, Vadodara',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <PageTransition>
      <div className="space-y-5 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-primary">Settings</h1>

        {/* Tabs */}
        <div className="flex border-b border-subtle">
          {['Profile', 'Subscription', 'Staff & Permissions'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab ? 'border-gold text-primary bg-gold/5' : 'border-transparent text-secondary hover:text-primary hover:bg-tertiary'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <form onSubmit={handleSave} className="bg-secondary border border-subtle rounded-xl p-8 space-y-6 shadow-sm">
            {/* Avatar */}
            <div className="flex items-center gap-5 pb-6 border-b border-subtle">
              <div className="relative group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center text-xl font-bold border-2 border-gold shadow-lg">
                  {profile.ownerName.substring(0, 2).toUpperCase() || 'RP'}
                </div>
                <div className="absolute inset-0 rounded-full bg-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-bold uppercase tracking-wider">
                  Change
                </div>
              </div>
              <div>
                <p className="font-bold text-lg text-primary uppercase tracking-tight">{profile.ownerName}</p>
                <p className="text-sm text-secondary font-medium italic">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Shop Name', key: 'shopName', type: 'text' },
                { label: 'Owner Name', key: 'ownerName', type: 'text' },
                { label: 'Mobile', key: 'mobile', type: 'tel' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'GST Number', key: 'gst', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">{label}</label>
                  <input
                    type={type}
                    value={profile[key]}
                    onChange={(e) => setProfile(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-inner"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">State</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile(p => ({ ...p, state: e.target.value }))}
                  className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-inner"
                >
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-1">Shop Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))}
                rows={2}
                className="w-full bg-tertiary border border-subtle rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-inner resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit"
                className="flex items-center gap-2 bg-gold text-dark font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-md active:scale-95">
                {profileSaved && <Check size={18} className="text-[#1A3C2B] stroke-[3]" />}
                {profileSaved ? 'Success!' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Subscription Tab */}
        {activeTab === 'Subscription' && (
          <div className="space-y-4">
            {/* Current Plan */}
            <div className="bg-secondary border border-subtle rounded-xl p-8 border-l-[6px] border-l-gold shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-dark bg-gold px-3.5 py-1.5 rounded-lg shadow-sm">Current Plan</span>
                  <h2 className="font-display font-bold text-3xl text-primary mt-4">Basic</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Renews on</p>
                  <p className="font-mono font-bold text-primary text-sm">15 May 2025</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {['Up to 500 farmers', '5 staff accounts', 'Udhaar tracking', 'Basic analytics', 'Email support'].map(feature => (
                  <div key={feature} className="flex items-center gap-3 text-[13px] text-primary font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#2D9E5A]/20 flex items-center justify-center shrink-0 border border-[#2D9E5A]/30">
                      <Check size={12} className="text-[#2D9E5A] stroke-[3]" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
              <button className="w-full bg-forest text-gold font-bold py-4 rounded-xl hover:bg-forest/90 transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs">
                Upgrade to Premium →
              </button>
            </div>

            {/* Premium features preview */}
            <div className="bg-tertiary border border-subtle rounded-xl p-8 shadow-inner">
              <h3 className="font-bold text-primary mb-6 uppercase tracking-tight text-sm">Unlock Premium Performance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {['Unlimited farmers', 'AI Agronomist', 'Leaflet Map', 'Priority support', 'Custom QR cards', 'API access'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-xs text-secondary font-bold">
                    <span className="text-gold text-lg">✦</span> <span className="uppercase tracking-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'Staff & Permissions' && (
          <div className="bg-secondary border border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-subtle">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-sm text-primary uppercase tracking-tight">Ecosystem Personnel</h2>
                <div className="px-2 py-0.5 bg-tertiary border border-subtle rounded-md text-[10px] font-bold text-secondary">
                  {staff.length} TOTAL
                </div>
              </div>
              {user?.role === 'dealer' && (
                <button className="text-xs bg-gold text-dark font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-sm active:scale-95 uppercase">
                  + Add Member
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-tertiary border-b border-subtle">
                    {['Name', 'Role', 'Mobile', 'Status', ...(user?.role === 'dealer' ? ['Actions'] : [])].map(h => (
                      <th key={h} scope="col" className="px-4 py-3 text-left text-[10px] font-bold text-secondary uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, i) => (
                    <tr key={s.id} className={`border-b border-subtle last:border-0 transition-colors hover:bg-tertiary/50 ${i % 2 === 1 ? 'bg-primary/5' : 'bg-secondary'}`} style={{ height: '56px' }}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <FarmerAvatar initials={s.avatar} size="sm" />
                          <span className="font-bold text-sm text-primary uppercase tracking-tight">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-secondary font-medium">{s.role}</td>
                      <td className="px-4 py-2 font-mono text-secondary/60 text-[11px] font-bold">{s.mobile}</td>
                      <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                      {user?.role === 'dealer' && (
                        <td className="px-4 py-2">
                          <button className="text-[11px] text-secondary hover:text-primary font-bold uppercase transition-colors mr-4">Edit</button>
                          <button
                            className="text-[11px] text-[#D44A4A] hover:text-[#D44A4A]/80 font-bold uppercase transition-colors"
                            onClick={() => setStaff(prev => prev.map(m => m.id === s.id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m))}
                          >
                            {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
