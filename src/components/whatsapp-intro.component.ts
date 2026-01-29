import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-whatsapp-intro',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-black flex flex-col items-center justify-center p-8">
      <div class="w-20 h-20 mb-8 relative">
        <div class="absolute inset-0 border-2 border-[#34C759] rounded-full animate-ping opacity-20"></div>
        <app-icon name="lock" class="w-full h-full text-[#34C759]"></app-icon>
      </div>
      <h2 class="text-white text-xl font-semibold mb-2">Canal Seguro</h2>
      <p class="text-center text-gray-500 text-sm mb-8">Inicializando conversa criptografada com Agente Evey...</p>
      
      <div class="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div class="h-full bg-[#34C759] transition-all duration-75" [style.width.%]="progress()"></div>
      </div>
      <p class="text-[#34C759] font-mono text-xs mt-4">Sincronizando banco de dados...</p>
    </div>
  `
})
export class WhatsappIntroComponent implements OnInit {
  onNext = output<void>();
  progress = signal(0);

  ngOnInit() {
    const timer = setInterval(() => {
      this.progress.update(old => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(() => this.onNext.emit(), 500);
          return 100;
        }
        return old + 2;
      });
    }, 30);
  }
}