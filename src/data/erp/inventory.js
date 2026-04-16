export const inventory = [
  {
    id: 'SKU001',
    name: 'DAP Fertilizer',
    brand: 'IFFCO',
    category: 'Fertilizer',
    unit: '50kg bag',
    price: 1350,
    stock: 42,
    minStock: 10,
    maxStock: 100,
    status: 'Healthy',
    lastUpdated: '2025-04-12',
    variants: [
      { sku: 'SKU001-A', size: '50kg', stock: 42, price: 1350 },
    ]
  },
  {
    id: 'SKU002',
    name: 'Urea',
    brand: 'KRIBHCO',
    category: 'Fertilizer',
    unit: '45kg bag',
    price: 266,
    stock: 8,
    minStock: 20,
    maxStock: 200,
    status: 'Reorder',
    lastUpdated: '2025-04-10',
    variants: [
      { sku: 'SKU002-A', size: '45kg', stock: 8, price: 266 },
    ]
  },
  {
    id: 'SKU003',
    name: 'Coragen Insecticide',
    brand: 'FMC',
    category: 'Pesticide',
    unit: '150ml bottle',
    price: 1850,
    stock: 24,
    minStock: 15,
    maxStock: 50,
    status: 'Healthy',
    lastUpdated: '2025-04-14',
    variants: [
      { sku: 'SKU003-A', size: '150ml', stock: 14, price: 1850 },
      { sku: 'SKU003-B', size: '60ml', stock: 10, price: 800 },
    ]
  },
  {
    id: 'SKU004',
    name: 'Pioneer 3355 Maize',
    brand: 'Corteva',
    category: 'Seed',
    unit: '4kg packet',
    price: 950,
    stock: 12,
    minStock: 15,
    maxStock: 60,
    status: 'Low',
    lastUpdated: '2025-04-05',
    variants: [
      { sku: 'SKU004-A', size: '4kg', stock: 12, price: 950 },
    ]
  },
  // Add 26 more random items
  ...Array.from({ length: 26 }).map((_, i) => ({
    id: `SKU00${i+5}`,
    name: `Product ${i+5}`,
    brand: ['Bayer', 'Syngenta', 'UPL'][i % 3],
    category: ['Fertilizer', 'Pesticide', 'Seed', 'Other'][i % 4],
    unit: '1kg',
    price: 500 + (100 * i),
    stock: Math.floor(Math.random() * 50),
    minStock: 10,
    maxStock: 50,
    status: i % 5 === 0 ? 'Reorder' : (i % 3 === 0 ? 'Low' : 'Healthy'),
    lastUpdated: '2025-04-15',
    variants: []
  }))
];
