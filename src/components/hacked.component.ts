import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-hacked-screen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <!-- Matrix Rain Background -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        @for(item of matrixDrops; track item.id) {
          <div class="absolute text-red-600 font-mono text-xl animate-matrix" 
               [style.left.%]="item.left" 
               [style.animationDuration.s]="item.duration" 
               [style.animationDelay.s]="item.delay">
            {{ item.char }}
          </div>
        }
      </div>

      <!-- Content -->
      <div class="z-10 text-center animate-glitch px-4">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-red-600 flex items-center justify-center bg-red-900/20">
          <app-icon name="lock" class="w-10 h-10 text-red-500"></app-icon>
        </div>
        <h1 class="text-red-600 text-3xl font-bold tracking-widest uppercase mb-4">LIGAÇÃO HACKEADA</h1>
        
        <div class="text-left max-w-[280px] mx-auto space-y-1">
          @for(log of logs(); track log) {
             <p class="text-red-500 font-mono text-xs typewriter overflow-hidden whitespace-nowrap">> {{ log }}</p>
          }
        </div>
      </div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse"></div>
      
      <!-- Footer Warning -->
      <div class="absolute bottom-4 right-4 flex items-center gap-1 opacity-50">
        <app-icon name="sparkles" class="w-3 h-3 text-red-500"></app-icon>
        <span class="text-[10px] text-red-500 font-mono">DANGER: SYSTEM BREACH</span>
      </div>
    </div>
  `
})
export class HackedScreenComponent implements OnInit {
  onComplete = output<void>();
  logs = signal<string[]>([
      "Estabelecendo conexão segura...", 
      "Buscando vagas remuneradas..."
  ]);
  
  // Reduced drops count for performance
  matrixDrops = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: Math.random() * 2 + 1,
    delay: Math.random(),
    char: Math.random() > 0.5 ? '1' : '0'
  }));

  ngOnInit() {
    const sequence = [
        { text: "Protocolo de Renda Ativo...", delay: 800 },
        { text: "Validando compatibilidade do dispositivo...", delay: 1800 },
        { text: "ACESSO PRIORITÁRIO ENCONTRADO!", delay: 3000 },
        { text: "Redirecionando para Agente de Liberação...", delay: 4000 }
    ];

    const timeouts: any[] = [];
    sequence.forEach(({ text, delay }) => {
        const t = setTimeout(() => {
            this.logs.update(l => [...l, text]);
        }, delay);
        timeouts.push(t);
    });

    const finalT = setTimeout(() => this.onComplete.emit(), 5000);
    timeouts.push(finalT);
  }
}