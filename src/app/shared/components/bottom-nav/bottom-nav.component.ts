import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-surface-cardDark/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 safe-bottom transition-colors">
      <div class="max-w-md mx-auto flex items-center justify-around py-2 px-3">
        <!-- 1. Início -->
        <a 
          routerLink="/dashboard" 
          routerLinkActive="text-brand-primary"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition py-1 px-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-[10px] font-semibold">Início</span>
        </a>

        <!-- 2. Despesas -->
        <a 
          routerLink="/expenses" 
          routerLinkActive="text-brand-primary"
          class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition py-1 px-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
          </svg>
          <span class="text-[10px] font-semibold">Despesas</span>
        </a>

        <!-- 3. Botão Central Destaque (+) -->
        <a 
          routerLink="/expenses" 
          [queryParams]="{ action: 'new' }"
          class="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-500 text-white flex items-center justify-center shadow-glow-primary active:scale-95 transition transform">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
        </a>

        <!-- 4. Investimentos -->
        <a 
          routerLink="/investments" 
          routerLinkActive="text-brand-primary"
          class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition py-1 px-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span class="text-[10px] font-semibold">Invest</span>
        </a>

        <!-- 5. Espaços / Mais -->
        <a 
          routerLink="/spaces" 
          routerLinkActive="text-brand-primary"
          class="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition py-1 px-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span class="text-[10px] font-semibold">Espaços</span>
        </a>
      </div>
    </nav>
  `
})
export class BottomNavComponent {}
