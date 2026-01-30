import { Component, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { ASSETS } from '../app.assets';

@Component({
  selector: 'app-outgoing-call',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-gradient-to-b from-[#1C1C1E] to-black flex flex-col items-center py-12 px-6">
      <div class="flex flex-col items-center gap-6 mt-12 z-10 animate-pulse">
        <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <img [src]="avatarEvey" class="w-full h-full object-cover" />
        </div>
        <div class="text-center">
          <h1 class="text-white text-3xl font-semibold mb-2 tracking-tight">52679588</h1>
          <p class="text-white/70 text-lg">Chamando agente-Evey</p>
        </div>
      </div>
      <div class="mt-auto w-full max-w-xs flex justify-center mb-16">
        <div class="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center shadow-lg">
          <app-icon name="phoneOff" class="w-9 h-9 text-white fill-current"></app-icon>
        </div>
      </div>
    </div>
  `
})
export class OutgoingCallComponent implements OnInit, OnDestroy {
  onConnected = output<void>();
  avatarEvey = ASSETS.images.avatarEvey;
  private audio: HTMLAudioElement | null = null;
  private fallbackTimer: any;

  ngOnInit() {
    this.audio = new Audio(ASSETS.audio.dialTone);
    
    const play = this.audio.play();
    if (play) {
        play.catch(() => {
            // If blocked, proceed anyway after short delay
            this.fallbackTimer = setTimeout(() => this.onConnected.emit(), 2000);
        });
    }

    this.audio.onended = () => {
      this.onConnected.emit();
    };
    
    // Safety fallback
    this.fallbackTimer = setTimeout(() => {
        if (this.audio && !this.audio.ended) {
            this.onConnected.emit();
        }
    }, 4000);
  }

  ngOnDestroy() {
    clearTimeout(this.fallbackTimer);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
