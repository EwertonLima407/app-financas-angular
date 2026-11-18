import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import { InvestmentService } from '../../core/services/investment.service';
import { SpaceService } from '../../core/services/space.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 pb-24">
      <!-- 1. Card Principal de Saldo (Destaque Fintech) -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-indigo-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-500/20">
        <!-- Detalhe decorativo de fundo -->
        <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex items-center justify-between mb-2">
          <span class="text-xs font-semibold tracking-wider uppercase text-indigo-200">
            {{ spaceService.activeSpace() ? 'Espaço: ' + spaceService.activeSpace()?.name : 'Saldo Geral Pessoal' }}
          </span>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-sm">
            Novembro / 2026
          </span>
        </div>

        <div class="relative z-10 mb-6">
          <p class="text-xs text-indigo-100 font-medium mb-1">Previsão Disponível</p>
          <h1 class="text-3xl font-extrabold tracking-tight">
            {{ (15000 - expenseService.totalMonth()) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
          </h1>
        </div>

        <!-- Mini cards de Resumo Internos -->
        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-red-400/20 flex items-center justify-center text-red-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-indigo-200 uppercase font-semibold">Despesas</p>
              <p class="text-sm font-bold text-white">
                {{ expenseService.totalMonth() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </div>
            <div>
              <p class="text-[10px] text-indigo-200 uppercase font-semibold">Em Metas</p>
              <p class="text-sm font-bold text-white">
                {{ investmentService.totalProjectsCurrent() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Ações Rápidas (Pills) -->
      <div>
        <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Ações Rápidas
        </h3>
        <div class="grid grid-cols-3 gap-2.5">
          <a 
            routerLink="/expenses" 
            [queryParams]="{ action: 'new' }"
            class="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-brand-primary active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-1.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Despesa</span>
          </a>

          <a 
            routerLink="/investments" 
            class="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-brand-primary active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-1.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Aporte</span>
          </a>

          <a 
            routerLink="/projects" 
            class="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-surface-cardDark border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-brand-primary active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center mb-1.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Metas</span>
          </a>
        </div>
      </div>

      <!-- 3. Próximos Vencimentos de Despesas -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Próximos Vencimentos
          </h3>
          <a routerLink="/expenses" class="text-xs font-semibold text-brand-primary hover:underline">
            Ver todas ({{ expenseService.expenses().length }})
          </a>
        </div>

        @if (expenseService.expenses().length === 0) {
          <div class="bg-white dark:bg-surface-cardDark rounded-2xl p-6 text-center border border-slate-200/80 dark:border-slate-800">
            <p class="text-xs text-slate-400">Nenhuma despesa cadastrada neste espaço.</p>
            <a routerLink="/expenses" class="mt-2 inline-block text-xs font-bold text-brand-primary">Cadastrar agora</a>
          </div>
        } @else {
          <div class="space-y-2.5">
            @for (expense of expenseService.expenses().slice(0, 4); track expense.id) {
              <div class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-subtleDark flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ expense.description }}</h4>
                    <p class="text-[11px] text-slate-400 font-medium">
                      {{ expense.due_date | date:'dd/MM/yyyy' }}
                      @if (expense.recurrence_type === 'INSTALLMENT') {
                        <span class="text-indigo-500 font-semibold ml-1">
                          (Parcela {{ expense.current_installment }}/{{ expense.total_installments }})
                        </span>
                      }
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {{ expense.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                  </p>
                  <span 
                    [ngClass]="expense.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {{ expense.status === 'PENDING' ? 'Pendente' : 'Pago' }}
                  </span>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- 4. Metas e Projetos Financeiros -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Metas Financeiras
          </h3>
          <a routerLink="/projects" class="text-xs font-semibold text-brand-primary hover:underline">
            Gerenciar
          </a>
        </div>

        @if (investmentService.projects().length === 0) {
          <div class="bg-white dark:bg-surface-cardDark rounded-2xl p-6 text-center border border-slate-200/80 dark:border-slate-800">
            <p class="text-xs text-slate-400">Nenhum projeto cadastrado.</p>
            <a routerLink="/projects" class="mt-2 inline-block text-xs font-bold text-brand-primary">Criar minha primeira meta</a>
          </div>
        } @else {
          <div class="space-y-3">
            @for (project of investmentService.projects(); track project.id) {
              <div class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ project.name }}</h4>
                  <span class="text-xs font-bold text-brand-primary">
                    {{ getProgress(project) }}%
                  </span>
                </div>
                <!-- Barra de progresso -->
                <div class="w-full bg-slate-100 dark:bg-surface-subtleDark h-2.5 rounded-full overflow-hidden">
                  <div 
                    class="bg-gradient-to-r from-brand-primary to-emerald-400 h-full rounded-full transition-all duration-500"
                    [style.width.%]="getProgress(project)">
                  </div>
                </div>
                <div class="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
                  <span>Atual: {{ project.current_amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                  <span>Meta: {{ project.target_amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  expenseService = inject(ExpenseService);
  investmentService = inject(InvestmentService);
  spaceService = inject(SpaceService);
  authService = inject(AuthService);

  constructor() {
    // Recarrega dados automaticamente se o usuário alternar de espaço
    effect(() => {
      const active = this.spaceService.activeSpace();
      this.loadAllData(active ? active.id : null);
    });
  }

  ngOnInit(): void {
    this.spaceService.loadSpaces().subscribe();
    this.loadAllData(this.spaceService.activeSpace()?.id || null);
  }

  loadAllData(spaceId: string | null): void {
    this.expenseService.loadExpenses(spaceId).subscribe();
    this.investmentService.loadPortfolios().subscribe();
    this.investmentService.loadProjects().subscribe();
  }

  getProgress(project: any): number {
    const cur = Number(project.current_amount) || 0;
    const tgt = Number(project.target_amount) || 1;
    const pct = Math.round((cur / tgt) * 100);
    return Math.min(100, pct);
  }
}
