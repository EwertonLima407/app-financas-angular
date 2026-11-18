import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../core/services/investment.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-28">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 dark:text-slate-100">Metas Financeiras</h1>
          <p class="text-xs text-slate-400 font-medium">Objetivos e projetos de economia</p>
        </div>
        <button 
          (click)="showModal = true"
          class="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-glow-primary active:scale-95 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nova Meta</span>
        </button>
      </div>

      <!-- Lista de Metas -->
      @if (investmentService.projects().length === 0) {
        <div class="p-8 text-center bg-white dark:bg-surface-cardDark rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p class="text-sm font-semibold text-slate-400">Nenhuma meta financeira cadastrada.</p>
          <button (click)="showModal = true" class="mt-2 text-xs font-bold text-brand-primary">Criar objetivo agora</button>
        </div>
      } @else {
        <div class="space-y-3.5">
          @for (project of investmentService.projects(); track project.id) {
            <div class="bg-white dark:bg-surface-cardDark p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center font-bold text-sm">
                    🎯
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ project.name }}</h3>
                    @if (project.deadline) {
                      <p class="text-[10px] text-slate-400">Prazo: {{ project.deadline | date:'dd/MM/yyyy' }}</p>
                    }
                  </div>
                </div>
                <span class="text-sm font-black text-brand-primary">
                  {{ getProgress(project) }}%
                </span>
              </div>

              <!-- Barra de Progresso com Animação -->
              <div class="w-full bg-slate-100 dark:bg-surface-subtleDark h-3 rounded-full overflow-hidden my-3">
                <div 
                  class="bg-gradient-to-r from-brand-primary to-emerald-400 h-full rounded-full transition-all duration-700"
                  [style.width.%]="getProgress(project)">
                </div>
              </div>

              <div class="flex justify-between items-center text-xs font-semibold">
                <span class="text-slate-600 dark:text-slate-300">
                  Acumulado: {{ project.current_amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                </span>
                <span class="text-slate-400">
                  Alvo: {{ project.target_amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                </span>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal Nova Meta -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 safe-bottom">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Novo Objetivo Financeiro</h3>
              <button (click)="showModal = false" class="p-1.5 text-slate-400">✕</button>
            </div>
            <form (ngSubmit)="submitProject()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nome da Meta</label>
                <input 
                  type="text" 
                  [(ngModel)]="newProject.name" 
                  name="name" 
                  placeholder="Ex: Viagem Japão, Reserva de Emergência, Carro Novo" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Valor Alvo (R$)</label>
                  <input 
                    type="number" 
                    [(ngModel)]="newProject.target_amount" 
                    name="target_amount" 
                    placeholder="10000.00" 
                    step="0.01" 
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Prazo Estimado</label>
                  <input 
                    type="date" 
                    [(ngModel)]="newProject.deadline" 
                    name="deadline" 
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-glow-primary active:scale-95 transition">
                Salvar Meta
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  investmentService = inject(InvestmentService);

  showModal = false;
  newProject = {
    name: '',
    target_amount: null as number | null,
    deadline: ''
  };

  ngOnInit(): void {
    this.investmentService.loadProjects().subscribe();
  }

  getProgress(project: any): number {
    const cur = Number(project.current_amount) || 0;
    const tgt = Number(project.target_amount) || 1;
    const pct = Math.round((cur / tgt) * 100);
    return Math.min(100, pct);
  }

  submitProject(): void {
    if (!this.newProject.name || !this.newProject.target_amount) return;
    this.investmentService.createProject({
      name: this.newProject.name,
      target_amount: Number(this.newProject.target_amount),
      deadline: this.newProject.deadline || undefined
    }).subscribe({
      next: () => {
        this.showModal = false;
        this.newProject = { name: '', target_amount: null, deadline: '' };
      }
    });
  }
}
