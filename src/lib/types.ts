export type Transaction = {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    category: string;
    subcategory?: string;
    notes?: string;
    receiptUrl?: string;
};

export type Category = {
    id: string;
    name: string;
    budget: number;
};

export type Profile = {
    avatarUrl: string;
    name?: string;
    currency?: string;
    theme?: 'light' | 'dark' | 'system';
};
