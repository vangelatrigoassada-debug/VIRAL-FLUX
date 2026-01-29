import { Component, OnInit, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { ASSETS } from '../app.assets';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <!-- Optimized Background Image: Reduced width to 720 and quality to 60 for mobile performance -->
    <div class="h-full w-full bg-cover bg-center flex flex-col relative" style="background-image: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=60&w=720&auto=format&fit=crop')">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        
        <div class="relative z-10 flex flex-col items-center pt-16 w-full">
            <div class="text-6xl font-thin text-white tracking-tighter drop-shadow-lg">{{ time() }}</div>
            <div class="text-lg text-white/90 font-light mt-1 drop-shadow-md capitalize">{{ date() }}</div>
        </div>

        <div class="relative z-10 w-full px-4 mt-12 space-y-2">
            <!-- HOOK MESSAGE -->
            <div (click)="onUnlock.emit()" class="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 cursor-pointer hover:bg-white/25 transition-colors border border-white/10 shadow-lg animate-fade-in-up group touch-manipulation">
                <div class="flex items-start justify-between mb-1">
                    <div class="flex items-center gap-2">
                        <div class="w-5 h-5 bg-[#25D366] rounded flex items-center justify-center">
                            <app-icon name="phone" class="w-3 h-3 text-white fill-current"></app-icon>
                        </div>
                        <span class="text-xs font-semibold text-white/80 uppercase">WHATSAPP • AGORA</span>
                    </div>
                </div>
                <div class="flex items-start gap-3 mt-2">
                    <div class="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex-shrink-0 overflow-hidden">
                        <img [src]="avatarEvey" class="w-full h-full object-cover opacity-80" />
                    </div>
                    <div>
                        <h4 class="text-white font-bold text-sm group-hover:text-[#25D366] transition-colors">Agente Evey</h4>
                        <p class="text-white/90 text-sm leading-tight mt-0.5">⚠️ <span class="font-bold">SUA VAGA FOI RESERVADA!</span> Toque para falar comigo antes que expire.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-auto relative z-10 pb-8 flex justify-center">
            <div class="w-32 h-1 bg-white/50 rounded-full"></div>
        </div>
    </div>
  `
})
export class LockScreenComponent implements OnInit, OnDestroy {
  onUnlock = output<void>();
  avatarEvey = ASSETS.images.avatarEvey;
  time = signal('');
  date = signal('');
  private timer: any;

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  updateTime() {
    this.time.set(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }));
    this.date.set(new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: 'numeric', month: 'long' }));
  }
}