import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-tiktok-secret',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-black text-white flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
         <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
         
         <div class="relative z-10 w-full max-w-sm flex flex-col gap-6 animate-fade-in-up">
            <div class="flex justify-center mb-8">
                <svg class="w-16 h-16 fill-white" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
            </div>
            <h1 class="text-2xl font-bold text-center mb-2">Login no App Secreto</h1>
            <div class="space-y-4">
                <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Usuário Licenciado</label>
                    <input type="text" value="@agente_Vinganca" readonly class="w-full bg-[#161823] border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:border-gray-500 font-medium" />
                </div>
                <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Senha de Resgate</label>
                    <div class="relative">
                        <input [type]="showPassword() ? 'text' : 'password'" value="Vingança2026" readonly class="w-full bg-[#161823] border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:border-gray-500 font-medium pr-10" />
                        <button type="button" class="absolute right-3 top-3 text-gray-400 focus:outline-none" (click)="togglePass()">
                           <app-icon [name]="showPassword() ? 'eyeOff' : 'eye'" class="w-5 h-5"></app-icon>
                        </button>
                    </div>
                </div>
            </div>
            <button (click)="onLogin.emit()" class="w-full bg-[#FE2C55] hover:bg-[#E0264D] text-white font-bold py-3.5 rounded-sm transition-colors mt-4 shadow-[0_0_15px_rgba(254,44,85,0.4)] touch-manipulation">ACESSAR FERRAMENTA</button>
         </div>
    </div>
  `
})
export class TikTokSecretComponent {
  onLogin = output<void>();
  showPassword = signal(true);

  togglePass() {
    this.showPassword.update(v => !v);
  }
}