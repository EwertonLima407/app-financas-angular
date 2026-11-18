import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, BottomNavComponent],
  template: `
    <div class="min-h-screen bg-bg-appLight dark:bg-bg-appDark text-slate-800 dark:text-slate-100 transition-colors duration-200">
      @if (authService.isAuthenticated()) {
        <app-header />
        <main class="max-w-md mx-auto px-4 pt-4 pb-20">
          <router-outlet />
        </main>
        <app-bottom-nav />
      } @else {
        <router-outlet />
      }
    </div>
  `
})
export class AppComponent {
  authService = inject(AuthService);
}
