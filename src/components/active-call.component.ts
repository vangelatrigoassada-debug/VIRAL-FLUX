import { Component, OnInit, OnDestroy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-active-call',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-gradient-to-b from-[#1C1C1E] to-black flex flex-col items-center py-12 px-6">
      
      @if (hackMode()) {
        <div class="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-pulse"></div>
      }

      <div class="flex flex-col items-center gap-4 mt-8">
        <div class="w-24 h-24 rounded-full overflow-hidden border-2" 
             [class.border-white-10]="!hackMode()"
             [class.border-green-500-30]="hackMode() && isHacked()"
             [class.shadow-green]="hackMode() && isHacked()">
          <img [src]="avatar()" class="w-full h-full object-cover" fetchpriority="high" loading="eager" />
        </div>
        
        <div class="text-center">
          <h2 class="text-white text-3xl font-medium tracking-tight">{{ name() }}</h2>
          @if (hackMode()) {
             <p class="text-sm font-mono mt-2 uppercase" 
                [class.text-green-500]="isHacked()" 
                [class.animate-pulse]="isHacked()"
                [class.text-blue-400]="!isHacked()">
               {{ statusText() }}
             </p>
          }
          <p class="text-white/60 mt-1">{{ formattedTime() }}</p>
        </div>
      </div>

      <div class="mt-auto w-full max-w-xs">
        <div class="grid grid-cols-3 gap-6 mb-12">
           @for(item of buttons; track item.label) {
             <div class="flex flex-col items-center gap-2">
               <button class="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white touch-manipulation active:scale-95 transition-transform">
                 <app-icon [name]="item.icon" class="w-7 h-7"></app-icon>
               </button>
               <span class="text-white text-xs capitalize">{{ item.label }}</span>
             </div>
           }
        </div>
        
        @if (!hackMode()) {
           <div class="flex justify-center mb-8">
             <button 
               (click)="handleEnd()" 
               [class.opacity-50]="disableHangup()"
               [class.cursor-not-allowed]="disableHangup()"
               [style.pointer-events]="disableHangup() ? 'none' : 'auto'"
               class="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center shadow-lg transition-all touch-manipulation"
               [class.hover:bg-[#ff453a]]="!disableHangup()"
             >
               <app-icon name="phoneOff" class="w-9 h-9 text-white fill-current"></app-icon>
             </button>
           </div>
        }
      </div>
    </div>
  `
})
export class ActiveCallComponent implements OnInit, OnDestroy {
  avatar = input.required<string>();
  name = input.required<string>();
  audioSrc = input.required<string>();
  hackMode = input<boolean>(false); 
  disableHangup = input<boolean>(false);
  
  onEnd = output<void>();

  duration = signal(0);
  statusText = signal("VERIFICANDO DADOS...");
  isHacked = signal(false);

  formattedTime = computed(() => {
    const s = this.duration();
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  });

  private timerInterval: any;
  private audio: HTMLAudioElement | null = null;

  buttons = [
    { icon: 'micOff', label: 'mudo' },
    { icon: 'grid3x3', label: 'teclado' },
    { icon: 'volume2', label: 'audio' },
    { icon: 'plus', label: 'adicionar' },
    { icon: 'video', label: 'FaceTime' },
    { icon: 'users', label: 'contatos' }
  ];

  ngOnInit() {
    this.timerInterval = setInterval(() => this.duration.update(v => v + 1), 1000);
    
    this.audio = new Audio(this.audioSrc());
    this.audio.play().catch(e => console.log('Audio error', e));
    
    this.audio.onended = () => {
      if (this.hackMode()) {
        this.statusText.set("ACESSO LIBERADO: VAGA RESERVADA");
        this.isHacked.set(true);
        setTimeout(() => this.onEnd.emit(), 2000);
      } else {
        setTimeout(() => this.onEnd.emit(), 1000);
      }
    };
  }

  handleEnd() {
    if (!this.disableHangup()) {
      this.onEnd.emit();
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}