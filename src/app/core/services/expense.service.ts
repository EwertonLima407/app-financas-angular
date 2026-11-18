import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Expense, Category, Subcategory, CreateExpenseDTO } from '../models/expense.models';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3333/api';

  // Signals de estado
  expenses = signal<Expense[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  // Computed signals
  totalMonth = computed(() =>
    this.expenses().reduce((sum, exp) => sum + Number(exp.amount), 0)
  );

  totalPending = computed(() =>
    this.expenses()
      .filter(exp => exp.status === 'PENDING')
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  );

  totalPaid = computed(() =>
    this.expenses()
      .filter(exp => exp.status === 'PAID')
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
  );

  loadExpenses(spaceId?: string | null): Observable<any> {
    this.isLoading.set(true);
    const params: any = {};
    if (spaceId) {
      params.space_id = spaceId;
    }

    return this.http.get<any>(`${this.apiUrl}/expenses`, { params }).pipe(
      tap(res => {
        const list = Array.isArray(res) ? res : (res.data || []);
        this.expenses.set(list);
        this.isLoading.set(false);
      })
    );
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      tap(list => this.categories.set(list))
    );
  }

  getSubcategories(categoryId: string): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }

  createExpense(data: CreateExpenseDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/expenses`, data).pipe(
      tap(() => this.loadExpenses(data.space_id).subscribe())
    );
  }

  getInstallments(expenseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expenses/${expenseId}/installments`);
  }

  deleteExpense(expenseId: string, spaceId?: string | null): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${expenseId}`).pipe(
      tap(() => {
        this.expenses.update(list => list.filter(e => e.id !== expenseId));
      })
    );
  }
}
