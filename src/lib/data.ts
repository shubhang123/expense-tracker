export const categories = [
  { id: 'medicine', name: 'Medicine', budget: 10200 },
  { id: 'grocery', name: 'Grocery', budget: 5850 },
  { id: 'loan-emi', name: 'Loan EMI', budget: 22900 },
  { id: 'health', name: 'Health', budget: 2000 },
  { id: 'entertainment', name: 'Entertainment', budget: 1500 },
  { id: 'transport', name: 'Transport', budget: 1000 },
  { id: 'utilities', name: 'Utilities', budget: 3000 },
  { id: 'uncategorized', name: 'Uncategorized', budget: 0 },
];

export const transactions = [
  // Groceries
  {
    id: 'trx-1',
    date: '2023-08-10T10:00:00.000Z',
    merchant: 'D Mart',
    amount: -580,
    category: 'Grocery',
    subcategory: 'Crockery',
    notes: 'New plates and bowls',
  },
  {
    id: 'trx-2',
    date: '2023-08-10T10:05:00.000Z',
    merchant: 'D Mart',
    amount: -690,
    category: 'Grocery',
    subcategory: 'Homeware',
    notes: 'Kitchen towels and containers',
  },
  {
    id: 'trx-3',
    date: '2023-08-10T10:10:00.000Z',
    merchant: 'D Mart',
    amount: -292,
    category: 'Grocery',
    subcategory: 'Beans',
    notes: 'Weekly stock of beans',
  },
  {
    id: 'trx-4',
    date: '2023-08-10T10:15:00.000Z',
    merchant: 'D Mart',
    amount: -193,
    category: 'Grocery',
    subcategory: 'Vegetables',
    notes: 'Fresh vegetables',
  },

  // Medicine
  {
    id: 'trx-5',
    date: '2023-08-12T15:30:00.000Z',
    merchant: 'Pharmacy',
    amount: -2200,
    category: 'Medicine',
    subcategory: 'Prescription A',
    notes: 'Monthly prescription refill',
  },
  {
    id: 'trx-6',
    date: '2023-08-12T15:35:00.000Z',
    merchant: 'Pharmacy',
    amount: -1500,
    category: 'Medicine',
    subcategory: 'Vitamins',
    notes: 'Vitamin D and C supplements',
  },
  {
    id: 'trx-7',
    date: '2023-08-12T15:40:00.000Z',
    merchant: 'Pharmacy',
    amount: -800,
    category: 'Medicine',
    subcategory: 'Painkillers',
    notes: 'Stocking up on ibuprofen',
  },
  {
    id: 'trx-8',
    date: '2023-08-12T15:45:00.000Z',
    merchant: 'Pharmacy',
    amount: -600,
    category: 'Medicine',
    subcategory: 'First Aid',
    notes: 'Band-aids and antiseptic wipes',
  },

  // Loan EMI
  {
    id: 'trx-9',
    date: '2023-08-05T08:00:00.000Z',
    merchant: 'Bank EMI',
    amount: -15000,
    category: 'Loan EMI',
    subcategory: 'Car Loan',
    notes: 'August car loan payment',
  },
  {
    id: 'trx-10',
    date: '2023-08-05T08:05:00.000Z',
    merchant: 'Bank EMI',
    amount: -7900,
    category: 'Loan EMI',
    subcategory: 'Home Loan',
    notes: 'August home loan payment',
  },
  
  // Health
  {
    id: 'trx-11',
    date: '2023-08-20T11:00:00.000Z',
    merchant: 'Gym',
    amount: -800,
    category: 'Health',
    subcategory: 'Membership',
    notes: 'Monthly gym fee',
  },
  
  // Entertainment
  {
    id: 'trx-12',
    date: '2023-08-18T20:00:00.000Z',
    merchant: 'Cinema',
    amount: -1200,
    category: 'Entertainment',
    subcategory: 'Movies',
    notes: 'Tickets for two',
  },
];
