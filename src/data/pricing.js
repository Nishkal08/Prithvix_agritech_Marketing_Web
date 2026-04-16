// Replace with: GET /api/pricing → { name, price, period, description, highlighted, badge, features, cta }
export const plans = [
  {
    name: 'Basic',
    price: '₹499',
    period: '/month',
    description: 'For small dealers just getting started.',
    highlighted: false,
    features: [
      'Up to 100 farmers',
      'Field visit logging',
      'Basic Udhaar tracking',
      'Inventory management',
      '1 staff account',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Premium',
    price: '₹1,199',
    period: '/month',
    description: 'For growing dealers who want the full picture.',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Unlimited farmers',
      'AI Agronomist Chat (5 languages)',
      'QR Farmer ID Cards',
      'Advanced Analytics + Map',
      'Up to 5 staff accounts',
      'WhatsApp reminders',
      'Priority support',
      'Offline mode',
    ],
    cta: 'Start Free Trial',
  },
];
