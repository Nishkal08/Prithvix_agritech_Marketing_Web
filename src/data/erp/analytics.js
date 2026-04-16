export const analytics = {
  kpis: [
    { label: "Today's Registrations", value: 4, icon: 'UserPlus', delta: '+2 vs yesterday', trend: 'up' },
    { label: 'Total Field Visits', value: 1284, icon: 'MapPin', delta: '+12 this week', trend: 'up' },
    { label: 'Money Collected', value: '₹84,200', icon: 'TrendingUp', delta: 'this month', trend: 'up' },
    { label: 'Total Outstanding', value: '₹1,24,500', icon: 'AlertCircle', delta: '18 farmers', trend: 'warn' },
  ],
  revenueData: {
    today: [
      { time: '9am', value: 2400 },
      { time: '12pm', value: 8500 },
      { time: '3pm', value: 5200 },
      { time: '6pm', value: 12000 },
    ],
    thisWeek: [
      { day: 'Mon', value: 14200 },
      { day: 'Tue', value: 28500 },
      { day: 'Wed', value: 18000 },
      { day: 'Thu', value: 34000 },
      { day: 'Fri', value: 42000 },
      { day: 'Sat', value: 12500 },
      { day: 'Sun', value: 8000 },
    ],
    thisMonth: [
      { week: 'W1', value: 68000 },
      { week: 'W2', value: 82000 },
      { week: 'W3', value: 45000 },
      { week: 'W4', value: 95000 },
    ],
    allTime: [
      { month: 'Jan', value: 142000 },
      { month: 'Feb', value: 185000 },
      { month: 'Mar', value: 260000 },
      { month: 'Apr', value: 284000 },
    ]
  },
  farmerGrowth: [
    { date: 'Day 1', count: 120 },
    { date: 'Day 7', count: 135 },
    { date: 'Day 14', count: 180 },
    { date: 'Day 21', count: 210 },
    { date: 'Day 30', count: 262 },
  ],
  collectionData: [
    { name: 'Collected', value: 84200, color: '#1A3C2B' },
    { name: 'Outstanding', value: 124500, color: '#D4A853' },
  ],
  inventoryBreakdown: [
    { category: 'Fertilizer', value: 45 },
    { category: 'Pesticide', value: 30 },
    { category: 'Seed', value: 15 },
    { category: 'Other', value: 10 },
  ]
};
