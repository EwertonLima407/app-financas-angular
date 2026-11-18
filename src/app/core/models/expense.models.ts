export interface Category {
  id: string;
  name: string;
  is_default: boolean;
  space_id?: string | null;
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  space_id?: string | null;
  subcategory_id: string;
  parent_expense_id?: string | null;
  description: string;
  amount: number | string;
  due_date: string;
  status: 'PENDING' | 'PAID';
  recurrence_type: 'SINGLE' | 'INSTALLMENT' | 'RECURRING';
  current_installment?: number;
  total_installments?: number;
  is_shared: boolean;
  created_at?: string;
  updated_at?: string;
  subcategory_name?: string;
  category_name?: string;
}

export interface CreateExpenseDTO {
  description: string;
  amount: number;
  due_date: string;
  subcategory_id: string;
  recurrence_type: 'SINGLE' | 'INSTALLMENT' | 'RECURRING';
  total_installments?: number;
  space_id?: string | null;
  is_shared?: boolean;
}
