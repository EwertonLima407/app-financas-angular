export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  total_balance?: number;
}

export interface FinancialProject {
  id: string;
  user_id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  deadline?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentTransaction {
  id: string;
  portfolio_id: string;
  user_id: string;
  project_id?: string | null;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'CONTRIBUTION';
  asset_code?: string;
  amount: number | string;
  unit_price?: number | string;
  quantity?: number | string;
  transaction_date: string;
  recurrence_type?: 'SINGLE' | 'RECURRING';
  created_at?: string;
}
