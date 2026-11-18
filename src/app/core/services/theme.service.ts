import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(localStorage.getItem('finance_theme') === 'dark');

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      if (dark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('finance_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('finance_theme', 'light');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(prev => !prev);
  }
}
