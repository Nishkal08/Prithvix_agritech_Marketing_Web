export const recentActivity = [
  { id: 1, type: 'UserPlus', action: 'Ramesh Patel registered by Harish', context: 'Farmer', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() }, // 30m ago
  { id: 2, type: 'CreditCard', action: '₹2,000 payment received from Suresh Yadav', context: 'Payment', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() }, // 2h ago
  { id: 3, type: 'MapPin', action: 'Field visit logged at Harman Singh farm', context: 'Visit', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }, // 4h ago
  { id: 4, type: 'Package', action: 'Restocked 100 bags of DAP Fertilizer', context: 'Stock', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }, // 1d ago
  { id: 5, type: 'MapPin', action: 'Field visit logged at Amol Deshmukh farm', context: 'Visit', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() }, // 1d ago
  { id: 6, type: 'CreditCard', action: '₹10,000 credit approved for Amol Deshmukh', context: 'Credit', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() }, // 2d ago
  { id: 7, type: 'UserPlus', action: 'Suresh Yadav registered', context: 'Farmer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() }, // 3d ago
  { id: 8, type: 'Package', action: 'Sold 5 bottles of Coragen Insecticide', context: 'Sale', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73).toISOString() }, // 3d ago
];
