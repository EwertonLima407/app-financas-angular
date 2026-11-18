import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Portfolio, FinancialProject, InvestmentTransaction } from '../models/investment.models';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3333/api';

  // Signals
  portfolios = signal<Portfolio[]>([]);
  projects = signal<FinancialProject[]>([]);
  isLoading = signal<boolean>(false);

  totalProjectsTarget = computed(() =>
    this.projects().reduce((sum, p) => sum + Number(p.target_amount), 0)
  );

  totalProjectsCurrent = computed(() =>
    this.projects().reduce((sum, p) => sum + Number(p.current_amount), 0)
  );

  loadPortfolios(): Observable<Portfolio[]> {
    this.isLoading.set(true);
    return this.http.get<Portfolio[]>(`${this.apiUrl}/portfolios`).pipe(
      tap(res => {
        this.portfolios.set(res);
        this.isLoading.set(false);
      })
    );
  }

  createPortfolio(data: { name: string; description?: string }): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.apiUrl}/portfolios`, data).pipe(
      tap(created => {
        this.portfolios.update(list => [...list, created]);
      })
    );
  }

  loadProjects(): Observable<FinancialProject[]> {
    return this.http.get<FinancialProject[]>(`${this.apiUrl}/projects`).pipe(
      tap(res => this.projects.set(res))
    );
  }

  createProject(data: { name: string; target_amount: number; deadline?: string }): Observable<FinancialProject> {
    return this.http.post<FinancialProject>(`${this.apiUrl}/projects`, data).pipe(
      tap(created => {
        this.projects.update(list => [...list, created]);
      })
    );
  }

  createTransaction(data: {
    portfolio_id: string;
    project_id?: string | null;
    type: 'BUY' | 'SELL' | 'DIVIDEND' | 'CONTRIBUTION';
    asset_code?: string;
    amount: number;
    transaction_date: string;
    recurrence_type?: 'SINGLE' | 'RECURRING';
  }): Observable<InvestmentTransaction> {
    return this.http.post<InvestmentTransaction>(`${this.apiUrl}/transactions`, data).pipe(
      tap(() => {
        this.loadProjects().subscribe();
        this.loadPortfolios().subscribe();
      })
    );
  }
}
