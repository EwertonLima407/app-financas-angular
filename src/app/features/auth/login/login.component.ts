import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 flex flex-col justify-center px-4 py-8 safe-top safe-bottom">
      <div class="max-w-md w-full mx-auto">
        <!-- Logo e Cabeçalho -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-brand-primary to-emerald-400 p-0.5 shadow-glow-primary">
            <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Finanças Inteligentes</h1>
          <p class="text-sm text-slate-400 mt-1">Gestão de Despesas & Investimentos</p>
        </div>

        <!-- Card de Formulário -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
          <h2 class="text-lg font-bold mb-4">Acesse sua conta</h2>

          @if (errorMessage) {
            <div class="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                formControlName="email"
                placeholder="seu.email@exemplo.com"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Senha</label>
              <input 
                type="password" 
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"/>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-glow-primary active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2">
              @if (isLoading) {
                <span class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>Entrando...</span>
              } @else {
                <span>Entrar no App</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-white/10 text-center">
            <p class="text-xs text-slate-400">
              Ainda não tem conta?
              <a routerLink="/register" class="text-brand-primary font-bold hover:underline ml-1">Criar conta</a>
            </p>
          </div>
        </div>

        <div class="mt-8 text-center text-xs text-slate-500">
          🔒 Seus dados criptografados e protegidos
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['ewerton@finance.com', [Validators.required, Validators.email]],
    password: ['senhaSegura123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou senha inválidos. Tente novamente.';
      }
    });
  }
}
