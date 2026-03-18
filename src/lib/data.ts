export const categories = [
  { id: 'living', name: 'ATRIUM', budget: 5800 },
  { id: 'grocery', name: 'CULTIVATION', budget: 2200 },
  { id: 'health', name: 'VITALITY', budget: 1600 },
  { id: 'entertainment', name: 'CURATION', budget: 1500 },
  { id: 'transport', name: 'FLOW', budget: 1000 },
  { id: 'utilities', name: 'STRUCTURE', budget: 3000 },
  { id: 'uncategorized', name: 'UNCATEGORIZED', budget: 0 },
];

export const transactions = [
  // Living (Atrium)
  {
    id: 'trx-1',
    date: '2023-08-10T10:00:00.000Z',
    merchant: 'Estate Management',
    amount: -4200,
    category: 'living',
    subcategory: 'Rent',
    notes: 'Monthly allocation for atrium maintenance',
  },
  // Grocery (Cultivation)
  {
    id: 'trx-2',
    date: '2023-08-10T10:05:00.000Z',
    merchant: 'Organic Harvest',
    amount: -980,
    category: 'grocery',
    subcategory: 'Farming',
    notes: 'Fresh cultivation supplies',
  },
  // Health (Vitality)
  {
    id: 'trx-3',
    date: '2023-08-12T15:30:00.000Z',
    merchant: 'Wellness Sanctuary',
    amount: -1850,
    category: 'health',
    subcategory: 'Prescription',
    notes: 'Vitality supplements',
  },
  // Entertainment (Curation)
  {
    id: 'trx-4',
    date: '2023-08-18T20:00:00.000Z',
    merchant: 'Galleria',
    amount: -420,
    category: 'entertainment',
    subcategory: 'Art',
    notes: 'Curation of local aesthetics',
  },
];
