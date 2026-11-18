import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../core/services/space.service';
import { SharedSpace, SpaceMember } from '../../core/models/space.models';

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 pb-28">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-slate-800 dark:text-slate-100">Espaços Compartilhados</h1>
          <p class="text-xs text-slate-400 font-medium">Finanças colaborativas para casais, famílias ou negócios</p>
        </div>
        <button 
          (click)="showCreateModal = true"
          class="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold shadow-glow-primary active:scale-95 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Novo Espaço</span>
        </button>
      </div>

      <!-- Card Informativo de Privacidade -->
      <div class="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
        <div class="flex items-start gap-2.5">
          <span class="text-base">🔒</span>
          <div>
            <h4 class="font-bold">Privacidade Total Garantida</h4>
            <p class="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
              Seus lançamentos particulares nunca são compartilhados. Somente despesas explicitamente marcadas com "Compartilhado" ficam visíveis para outros membros deste espaço.
            </p>
          </div>
        </div>
      </div>

      <!-- Lista de Espaços -->
      <div class="space-y-3">
        <!-- Card do Espaço Particular (Padrão) -->
        <div 
          (click)="spaceService.setActiveSpace(null)"
          [class.ring-2]="!spaceService.activeSpace()"
          [class.ring-brand-primary]="!spaceService.activeSpace()"
          class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-sm hover:border-brand-primary transition">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-subtleDark flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Modo Particular (Privado)</h3>
                <p class="text-xs text-slate-400">Suas despesas e contas individuais</p>
              </div>
            </div>
            @if (!spaceService.activeSpace()) {
              <span class="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                Ativo
              </span>
            }
          </div>
        </div>

        <!-- Espaços Compartilhados do Usuário -->
        @for (space of spaceService.spaces(); track space.id) {
          <div 
            [class.ring-2]="spaceService.activeSpace()?.id === space.id"
            [class.ring-brand-primary]="spaceService.activeSpace()?.id === space.id"
            class="bg-white dark:bg-surface-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center text-lg">
                  👥
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ space.name }}</h3>
                  <p class="text-xs text-slate-400">{{ space.description || 'Espaço compartilhado' }}</p>
                </div>
              </div>
              <button 
                (click)="spaceService.setActiveSpace(space)"
                [class.bg-brand-primary]="spaceService.activeSpace()?.id === space.id"
                [class.text-white]="spaceService.activeSpace()?.id === space.id"
                [class.bg-slate-100]="spaceService.activeSpace()?.id !== space.id"
                [class.text-slate-700]="spaceService.activeSpace()?.id !== space.id"
                [class.dark:bg-surface-subtleDark]="spaceService.activeSpace()?.id !== space.id"
                [class.dark:text-slate-200]="spaceService.activeSpace()?.id !== space.id"
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition">
                {{ spaceService.activeSpace()?.id === space.id ? 'Ativo' : 'Ativar' }}
              </button>
            </div>

            <!-- Botão de Ver / Adicionar Membros -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span class="text-slate-400 font-medium">Permissões: Dono / Gestor</span>
              <button 
                (click)="openMembersModal(space)"
                class="text-brand-primary font-bold hover:underline">
                Membros
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Modal Criar Espaço -->
      @if (showCreateModal) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 safe-bottom">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Novo Espaço Compartilhado</h3>
              <button (click)="showCreateModal = false" class="p-1.5 text-slate-400">✕</button>
            </div>
            <form (ngSubmit)="submitSpace()" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nome do Espaço</label>
                <input 
                  type="text" 
                  [(ngModel)]="newSpace.name" 
                  name="name" 
                  placeholder="Ex: Família Silva, Casa da Praia, Projeto X" 
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Descrição</label>
                <input 
                  type="text" 
                  [(ngModel)]="newSpace.description" 
                  name="description" 
                  placeholder="Ex: Despesas conjuntas do casal" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-subtleDark text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-primary"/>
              </div>
              <button 
                type="submit" 
                class="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-glow-primary active:scale-95 transition">
                Criar Espaço
              </button>
            </form>
          </div>
        </div>
      }

      <!-- Modal de Membros -->
      @if (showMembersModal && currentSpace) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white dark:bg-surface-cardDark rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 safe-bottom max-h-[85vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                Membros de {{ currentSpace.name }}
              </h3>
              <button (click)="showMembersModal = false" class="p-1.5 text-slate-400">✕</button>
            </div>

            <!-- Lista de Membros -->
            <div class="space-y-2 mb-4">
              @for (member of members; track member.id) {
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-surface-subtleDark">
                  <div>
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-100">{{ member.user_name || member.user_email || 'Membro' }}</p>
                    <p class="text-[10px] text-slate-400">{{ member.user_email }}</p>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-brand-primary">
                    {{ member.role }}
                  </span>
                </div>
              }
            </div>

            <button 
              (click)="showMembersModal = false"
              class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
              Fechar
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class SpacesComponent implements OnInit {
  spaceService = inject(SpaceService);

  showCreateModal = false;
  showMembersModal = false;
  currentSpace: SharedSpace | null = null;
  members: SpaceMember[] = [];

  newSpace = { name: '', description: '' };

  ngOnInit(): void {
    this.spaceService.loadSpaces().subscribe();
  }

  submitSpace(): void {
    if (!this.newSpace.name) return;
    this.spaceService.createSpace(this.newSpace).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.newSpace = { name: '', description: '' };
      }
    });
  }

  openMembersModal(space: SharedSpace): void {
    this.currentSpace = space;
    this.showMembersModal = true;
    this.spaceService.getMembers(space.id).subscribe({
      next: (list) => this.members = list,
      error: () => this.members = []
    });
  }
}
