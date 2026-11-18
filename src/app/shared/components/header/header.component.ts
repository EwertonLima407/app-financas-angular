import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SpaceService } from '../../../core/services/space.service';
import { ThemeService } from '../../../core/services/theme.service';
import { SharedSpace } from '../../../core/models/space.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white/80 dark:bg-surface-cardDark/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 safe-top px-4 py-3 transition-colors">
      <div class="max-w-md mx-auto flex items-center justify-between">
        <!-- Perfil e Saudação -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-glow-primary">
            {{ userInitials() }}
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Bem-vindo(a),</p>
            <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {{ authService.currentUser()?.name || 'Investidor' }}
            </h2>
          </div>
        </div>

        <!-- Ações do Topo: Espaço + Tema + Logout -->
        <div class="flex items-center gap-2">
          <!-- Seletor de Espaço -->
          <div class="relative">
            <button 
              (click)="toggleSpaceMenu()"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-surface-subtleDark text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <svg class="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span>{{ spaceService.activeSpace()?.name || 'Particular' }}</span>
              <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown do Espaço -->
            @if (showSpaceMenu) {
              <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-cardDark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Modo de visualização
                </div>
                <button 
                  (click)="selectSpace(null)"
                  [class.text-brand-primary]="!spaceService.activeSpace()"
                  class="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-slate-700 dark:text-slate-200">
                  <span>🔒 Modo Particular</span>
                  @if (!spaceService.activeSpace()) {
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  }
                </button>
                @for (space of spaceService.spaces(); track space.id) {
                  <button 
                    (click)="selectSpace(space)"
                    [class.text-brand-primary]="spaceService.activeSpace()?.id === space.id"
                    class="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-slate-700 dark:text-slate-200">
                    <span class="truncate">👥 {{ space.name }}</span>
                    @if (spaceService.activeSpace()?.id === space.id) {
                      <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    }
                  </button>
                }
              </div>
            }
          </div>

          <!-- Botão Tema (Dark/Light) -->
          <button 
            (click)="themeService.toggleTheme()"
            aria-label="Alternar tema"
            class="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            @if (themeService.isDarkMode()) {
              <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
              </svg>
            } @else {
              <svg class="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            }
          </button>

          <!-- Logout -->
          <button 
            (click)="authService.logout()"
            title="Sair"
            class="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  spaceService = inject(SpaceService);
  themeService = inject(ThemeService);

  showSpaceMenu = false;

  userInitials(): string {
    const name = this.authService.currentUser()?.name || 'U';
    return name.slice(0, 2).toUpperCase();
  }

  toggleSpaceMenu(): void {
    this.showSpaceMenu = !this.showSpaceMenu;
  }

  selectSpace(space: SharedSpace | null): void {
    this.spaceService.setActiveSpace(space);
    this.showSpaceMenu = false;
  }
}
