import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import { SpaceService } from '../../core/services/space.service';
import { Expense, Category, Subcategory } from '../../core/models/expense.models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-5 pb-28">
      <!-- Cabeçalho da Tela -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 dark:text-slate-100">Despesas</h1>
          <p class="text-xs text-slate-400 font-medium">Controle de contas e parcelamentos</p>
        </div>
        <button 
          (click)="openModal()"
          class="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-glow-primary active:scale-95 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nova Despesa</span>
        </button>
      </div>

      <!-- Card de Total e Filtros -->
      <div class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Filtrado</p>
        <h2 class="text-2xl font-black text-slate-900 dark:text-slate-100 mb-3">
          {{ getFilteredTotal() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
        </h2>

        <!-- Chips de Filtro -->
        <div class="flex items-center gap-2">
          <button 
            (click)="filter = 'ALL'"
            [class.bg-brand-primary]="filter === 'ALL'"
            [class.text-white]="filter === 'ALL'"
            [class.bg-slate-100]="filter !== 'ALL'"
            [class.text-slate-600]="filter !== 'ALL'"
            [class.dark:bg-surface-subtleDark]="filter !== 'ALL'"
            [class.dark:text-slate-300]="filter !== 'ALL'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition">
            Todas ({{ expenseService.expenses().length }})
          </button>
          <button 
            (click)="filter = 'PENDING'"
            [class.bg-amber-500]="filter === 'PENDING'"
            [class.text-white]="filter === 'PENDING'"
            [class.bg-slate-100]="filter !== 'PENDING'"
            [class.text-slate-600]="filter !== 'PENDING'"
            [class.dark:bg-surface-subtleDark]="filter !== 'PENDING'"
            [class.dark:text-slate-300]="filter !== 'PENDING'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition">
            Pendentes
          </button>
          <button 
            (click)="filter = 'PAID'"
            [class.bg-emerald-500]="filter === 'PAID'"
            [class.text-white]="filter === 'PAID'"
            [class.bg-slate-100]="filter !== 'PAID'"
            [class.text-slate-600]="filter !== 'PAID'"
            [class.dark:bg-surface-subtleDark]="filter !== 'PAID'"
            [class.dark:text-slate-300]="filter !== 'PAID'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition">
            Pagas
          </button>
        </div>
      </div>

      <!-- Lista de Lançamentos -->
      @if (filteredExpenses().length === 0) {
        <div class="p-8 text-center bg-white dark:bg-surface-cardDark rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p class="text-sm font-semibold text-slate-400">Nenhum lançamento encontrado.</p>
          <button (click)="openModal()" class="mt-2 text-xs font-bold text-brand-primary">Adicionar agora</button>
        </div>
      } @else {
        <div class="space-y-2.5">
          @for (expense of filteredExpenses(); track expense.id) {
            <div class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-slate-300 transition">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-subtleDark flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ expense.description }}</h3>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5">
                    <span>{{ expense.due_date | date:'dd/MM/yyyy' }}</span>
                    @if (expense.recurrence_type === 'INSTALLMENT') {
                      <span class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-brand-primary text-[10px] font-bold">
                        Parcela {{ expense.current_installment }}/{{ expense.total_installments }}
                      </span>
                    }
                    @if (expense.recurrence_type === 'RECURRING') {
                      <span class="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-600 text-[10px] font-bold">
                        Mensal Fixa
                      </span>
                    }
                    @if (expense.is_shared) {
                      <span class="text-slate-400">👥</span>
                    }
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
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
                <button 
                  (click)="deleteExpense(expense.id)"
                  class="p-1.5 text-slate-300 hover:text-red-500 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Bottom Sheet Modal para Nova Despesa -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto safe-bottom">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-slate-100">Nova Despesa</h3>
              <button (click)="closeModal()" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            @if (formError) {
              <div class="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {{ formError }}
              </div>
            }

            <form (ngSubmit)="submitExpense()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Descrição</label>
                <input 
                  type="text" 
                  [(ngModel)]="newExpense.description" 
                  name="description" 
                  placeholder="Ex: Conta de Luz, Aluguel, Mercado" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Valor Total (R$)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="newExpense.amount" 
                    name="amount" 
                    placeholder="0.00" 
                    step="0.01" 
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Vencimento</label>
                  <input 
                    type="date" 
                    [(ngModel)]="newExpense.due_date" 
                    name="due_date" 
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
                </div>
              </div>

              <!-- Seleção de Categoria e Subcategoria -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Categoria</label>
                  <select 
                    [(ngModel)]="selectedCategoryId" 
                    (change)="onCategoryChange()"
                    name="categoryId"
                    required
                    class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary">
                    <option value="" disabled>Selecione...</option>
                    @for (cat of categories; track cat.id) {
                      <option [value]="cat.id">{{ cat.name }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Subcategoria</label>
                  <select 
                    [(ngModel)]="newExpense.subcategory_id" 
                    name="subcategory_id"
                    [disabled]="subcategories.length === 0"
                    required
                    class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary disabled:opacity-50">
                    <option value="" disabled>Selecione...</option>
                    @for (sub of subcategories; track sub.id) {
                      <option [value]="sub.id">{{ sub.name }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Tipo de Recorrência -->
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Recorrência</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    (click)="newExpense.recurrence_type = 'SINGLE'"
                    [ngClass]="newExpense.recurrence_type === 'SINGLE' ? 'border-brand-primary bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'"
                    class="py-2 px-2 text-center rounded-xl border text-xs font-bold transition">
                    Única
                  </button>
                  <button 
                    type="button"
                    (click)="newExpense.recurrence_type = 'INSTALLMENT'"
                    [ngClass]="newExpense.recurrence_type === 'INSTALLMENT' ? 'border-brand-primary bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'"
                    class="py-2 px-2 text-center rounded-xl border text-xs font-bold transition">
                    Parcelada
                  </button>
                  <button 
                    type="button"
                    (click)="newExpense.recurrence_type = 'RECURRING'"
                    [ngClass]="newExpense.recurrence_type === 'RECURRING' ? 'border-brand-primary bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'"
                    class="py-2 px-2 text-center rounded-xl border text-xs font-bold transition">
                    Fixa Mensal
                  </button>
                </div>
              </div>

              @if (newExpense.recurrence_type === 'INSTALLMENT') {
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Número de Parcelas (Meses)
                  </label>
                  <input 
                    type="number" 
                    [(ngModel)]="newExpense.total_installments" 
                    name="total_installments" 
                    min="2" 
                    max="60"
                    placeholder="Ex: 6, 12, 24" 
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
                  @if (newExpense.amount && newExpense.total_installments) {
                    <p class="text-[11px] text-brand-primary font-bold mt-1">
                      {{ newExpense.total_installments }}x de {{ (newExpense.amount / newExpense.total_installments) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} por mês
                    </p>
                  }
                </div>
              }

              <!-- Espaço Compartilhado -->
              @if (spaceService.activeSpace()) {
                <div class="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="isShared"
                    [(ngModel)]="newExpense.is_shared" 
                    name="is_shared"
                    class="rounded text-brand-primary focus:ring-brand-primary h-4 w-4"/>
                  <label for="isShared" class="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    Compartilhar com membros do espaço {{ spaceService.activeSpace()?.name }}
                  </label>
                </div>
              }

              <button 
                type="submit" 
                [disabled]="isSubmitting"
                class="w-full py-3.5 px-4 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white font-bold text-sm shadow-glow-primary active:scale-[0.98] transition flex items-center justify-center gap-2 mt-4">
                @if (isSubmitting) {
                  <span class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  <span>Gravando...</span>
                } @else {
                  <span>Salvar Lançamento</span>
                }
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ExpensesComponent implements OnInit {
  expenseService = inject(ExpenseService);
  spaceService = inject(SpaceService);
  private route = inject(ActivatedRoute);

  filter: 'ALL' | 'PENDING' | 'PAID' = 'ALL';
  showModal = false;
  isSubmitting = false;
  formError = '';

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  selectedCategoryId = '';

  newExpense = {
    description: '',
    amount: null as number | null,
    due_date: new Date().toISOString().split('T')[0],
    subcategory_id: '',
    recurrence_type: 'SINGLE' as 'SINGLE' | 'INSTALLMENT' | 'RECURRING',
    total_installments: 2,
    is_shared: true
  };

  ngOnInit(): void {
    this.expenseService.loadExpenses(this.spaceService.activeSpace()?.id || null).subscribe();
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.openModal();
      }
    });
  }

  loadCategories(): void {
    this.expenseService.loadCategories().subscribe({
      next: (list) => {
        this.categories = list;
        if (list.length > 0) {
          this.selectedCategoryId = list[0].id;
          this.onCategoryChange();
        }
      }
    });
  }

  onCategoryChange(): void {
    if (!this.selectedCategoryId) return;
    this.expenseService.getSubcategories(this.selectedCategoryId).subscribe({
      next: (subs) => {
        this.subcategories = subs;
        if (subs.length > 0) {
          this.newExpense.subcategory_id = subs[0].id;
        }
      }
    });
  }

  filteredExpenses(): Expense[] {
    const list = this.expenseService.expenses();
    if (this.filter === 'ALL') return list;
    return list.filter(e => e.status === this.filter);
  }

  getFilteredTotal(): number {
    return this.filteredExpenses().reduce((sum, e) => sum + Number(e.amount), 0);
  }

  openModal(): void {
    this.showModal = true;
    this.formError = '';
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitExpense(): void {
    if (!this.newExpense.description || !this.newExpense.amount || !this.newExpense.subcategory_id) {
      this.formError = 'Preencha a descrição, valor e subcategoria.';
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const payload: any = {
      description: this.newExpense.description,
      amount: Number(this.newExpense.amount),
      due_date: this.newExpense.due_date,
      subcategory_id: this.newExpense.subcategory_id,
      recurrence_type: this.newExpense.recurrence_type,
      is_shared: this.spaceService.activeSpace() ? this.newExpense.is_shared : false,
      space_id: this.spaceService.activeSpace()?.id || null
    };

    if (this.newExpense.recurrence_type === 'INSTALLMENT') {
      payload.total_installments = Number(this.newExpense.total_installments);
    }

    this.expenseService.createExpense(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.newExpense.description = '';
        this.newExpense.amount = null;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err.error?.message || 'Erro ao registrar despesa.';
      }
    });
  }

  deleteExpense(id: string): void {
    if (confirm('Deseja excluir esta despesa?')) {
      this.expenseService.deleteExpense(id, this.spaceService.activeSpace()?.id || null).subscribe();
    }
  }
}
