export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  subcategory?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
}
