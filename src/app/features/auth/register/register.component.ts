import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 flex flex-col justify-center px-4 py-8 safe-top safe-bottom">
      <div class="max-w-md w-full mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white tracking-tight">Criar Nova Conta</h1>
          <p class="text-sm text-slate-400 mt-1">Comece a gerenciar suas finanças hoje</p>
        </div>

        <div class="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
          @if (errorMessage) {
            <div class="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo</label>
              <input 
                type="text" 
                formControlName="name"
                placeholder="Seu nome"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                formControlName="email"
                placeholder="seu.email@exemplo.com"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Senha (mínimo 6 caracteres)</label>
              <input 
                type="password" 
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"/>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading"
              class="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-glow-accent active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2">
              @if (isLoading) {
                <span class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                <span>Criando conta...</span>
              } @else {
                <span>Cadastrar e Começar</span>
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-white/10 text-center">
            <p class="text-xs text-slate-400">
              Já possui conta?
              <a routerLink="/login" class="text-brand-primary font-bold hover:underline ml-1">Fazer login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
      next: () => {
        // Loga automaticamente
        this.authService.login({ email: email!, password: password! }).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erro ao registrar usuário. Tente outro email.';
      }
    });
  }
}
