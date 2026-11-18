import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../core/services/investment.service';
import { Portfolio } from '../../core/models/investment.models';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-28">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 dark:text-slate-100">Investimentos</h1>
          <p class="text-xs text-slate-400 font-medium">Carteiras e aportes patrimoniais</p>
        </div>
        <button 
          (click)="showPortfolioModal = true"
          class="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-glow-primary active:scale-95 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nova Carteira</span>
        </button>
      </div>

      <!-- Resumo de Carteiras -->
      @if (investmentService.portfolios().length === 0) {
        <div class="p-8 text-center bg-white dark:bg-surface-cardDark rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">Nenhuma carteira criada</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Crie carteiras como "Renda Fixa", "Ações & FIIs" ou "Reserva de Emergência" para organizar seus aportes.
          </p>
          <button (click)="showPortfolioModal = true" class="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold">
            Criar Minha Primeira Carteira
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-3">
          @for (portfolio of investmentService.portfolios(); track portfolio.id) {
            <div class="bg-white dark:bg-surface-cardDark p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ portfolio.name }}</h3>
                    <p class="text-xs text-slate-400">{{ portfolio.description || 'Carteira de Investimentos' }}</p>
                  </div>
                </div>
                <button 
                  (click)="openTransactionModal(portfolio)"
                  class="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 transition">
                  + Aporte
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Nova Carteira -->
      @if (showPortfolioModal) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 safe-bottom">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Nova Carteira</h3>
              <button (click)="showPortfolioModal = false" class="p-1.5 text-slate-400">✕</button>
            </div>
            <form (ngSubmit)="submitPortfolio()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nome da Carteira</label>
                <input 
                  type="text" 
                  [(ngModel)]="newPortfolio.name" 
                  name="name" 
                  placeholder="Ex: Renda Fixa, Ações BR, Cripto" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Descrição</label>
                <input 
                  type="text" 
                  [(ngModel)]="newPortfolio.description" 
                  name="description" 
                  placeholder="Ex: Reserva para segurança e liquidez" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>
              <button 
                type="submit" 
                class="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-glow-primary active:scale-95 transition">
                Criar Carteira
              </button>
            </form>
          </div>
        </div>
      }

      <!-- Modal Novo Aporte / Transação -->
      @if (showTransactionModal) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 safe-bottom">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                Novo Aporte em {{ selectedPortfolio?.name }}
              </h3>
              <button (click)="showTransactionModal = false" class="p-1.5 text-slate-400">✕</button>
            </div>
            <form (ngSubmit)="submitTransaction()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Valor do Aporte (R$)</label>
                <input 
                  type="number" 
                  [(ngModel)]="newTransaction.amount" 
                  name="amount" 
                  placeholder="0.00" 
                  step="0.01" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Ativo / Código (Opcional)</label>
                <input 
                  type="text" 
                  [(ngModel)]="newTransaction.asset_code" 
                  name="asset_code" 
                  placeholder="Ex: Tesouro Selic, CDB 120%, PETR4" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Vincular a uma Meta (Opcional)</label>
                <select 
                  [(ngModel)]="newTransaction.project_id" 
                  name="project_id"
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary">
                  <option [ngValue]="null">Nenhuma meta específica</option>
                  @for (project of investmentService.projects(); track project.id) {
                    <option [value]="project.id">{{ project.name }}</option>
                  }
                </select>
              </div>

              <button 
                type="submit" 
                class="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-glow-accent active:scale-95 transition">
                Confirmar Aporte
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class InvestmentsComponent implements OnInit {
  investmentService = inject(InvestmentService);

  showPortfolioModal = false;
  showTransactionModal = false;
  selectedPortfolio: Portfolio | null = null;

  newPortfolio = { name: '', description: '' };
  newTransaction = {
    amount: null as number | null,
    asset_code: '',
    project_id: null as string | null
  };

  ngOnInit(): void {
    this.investmentService.loadPortfolios().subscribe();
    this.investmentService.loadProjects().subscribe();
  }

  submitPortfolio(): void {
    if (!this.newPortfolio.name) return;
    this.investmentService.createPortfolio(this.newPortfolio).subscribe({
      next: () => {
        this.showPortfolioModal = false;
        this.newPortfolio = { name: '', description: '' };
      }
    });
  }

  openTransactionModal(portfolio: Portfolio): void {
    this.selectedPortfolio = portfolio;
    this.showTransactionModal = true;
  }

  submitTransaction(): void {
    if (!this.selectedPortfolio || !this.newTransaction.amount) return;
    this.investmentService.createTransaction({
      portfolio_id: this.selectedPortfolio.id,
      amount: Number(this.newTransaction.amount),
      project_id: this.newTransaction.project_id,
      asset_code: this.newTransaction.asset_code || undefined,
      type: 'CONTRIBUTION',
      transaction_date: new Date().toISOString().split('T')[0]
    }).subscribe({
      next: () => {
        this.showTransactionModal = false;
        this.newTransaction = { amount: null, asset_code: '', project_id: null };
      }
    });
  }
}
