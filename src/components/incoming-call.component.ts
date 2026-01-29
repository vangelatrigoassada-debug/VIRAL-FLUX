import { Component, ElementRef, OnDestroy, OnInit, ViewChild, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { ASSETS } from '../app.assets';

@Component({
  selector: 'app-incoming-call',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-gradient-to-b from-[#1C1C1E] to-black flex flex-col items-center justify-between py-12 px-6 animate-fade-in relative overflow-hidden select-none will-change-transform"
         [class.animate-vibrate-screen]="!isAnswered()">
      
      <!-- Background Ping -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-64 h-64 bg-red-900/20 rounded-full animate-ping opacity-20"></div>
      </div>

      <!-- Caller Info -->
      <div class="flex flex-col items-center gap-6 mt-12 z-10">
        <div class="relative">
          <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <img [src]="avatarV" class="w-full h-full object-cover" fetchpriority="high" loading="eager" />
          </div>
        </div>
        <div class="text-center">
          <h1 class="text-white text-3xl font-semibold mb-2 tracking-tight">Número Privado</h1>
          <p class="text-[#34C759] text-lg font-medium animate-pulse">Chamada Criptografada...</p>
        </div>
      </div>

      <!-- Slider Area -->
      <div class="w-full flex flex-col items-center gap-8 mb-16 z-10 px-4">
        <div #sliderContainer class="relative w-full max-w-[300px] h-[80px] bg-white/20 backdrop-blur-md rounded-full p-1.5 ring-1 ring-white/10 overflow-hidden shadow-2xl">
          <!-- Slider Text -->
          <div class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <span class="text-white/80 text-lg font-medium animate-pulse tracking-wide ml-8">deslize para aceitar >></span>
            <div class="absolute right-6 text-white/50 animate-pulse flex">
              <!-- Animated Chevrons -->
            </div>
          </div>
          
          <!-- Shimmer Effect -->
          <div class="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

          <!-- Handle -->
          <div 
            class="absolute top-1.5 left-1.5 h-[68px] w-[68px] bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10 cursor-grab active:cursor-grabbing touch-manipulation will-change-transform" 
            (mousedown)="startDrag($event)"
            (touchstart)="startDrag($event)"
            [style.transform]="'translateX(' + dragX() + 'px)'"
            [style.transition]="isDragging() ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'"
          >
            <app-icon name="phone" class="w-8 h-8 text-[#34C759] fill-current animate-[pulse_2s_infinite]"></app-icon>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IncomingCallComponent implements OnInit, OnDestroy {
  onAnswer = output<void>();
  avatarV = ASSETS.images.avatarV;

  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;

  // Converted to signals for Zoneless Change Detection compatibility
  dragX = signal(0);
  isDragging = signal(false);
  isAnswered = signal(false);
  
  private audio: HTMLAudioElement | null = null;
  private vibrateInterval: any;
  private autoPlayInterval: any;

  ngOnInit() {
    // Setup Audio
    this.audio = new Audio(ASSETS.audio.vibration);
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 1.0;

    // Attempt autoplay
    const tryPlay = () => {
      if (this.audio && this.audio.paused) {
        this.audio.play().catch(() => {});
      }
    };
    tryPlay();
    this.autoPlayInterval = setInterval(tryPlay, 500);

    // Vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([1000, 500]);
      this.vibrateInterval = setInterval(() => navigator.vibrate([1000, 500]), 1500);
    }

    // Global listeners for drag
    this.addGlobalListeners();
    // Unlock audio on interaction
    window.addEventListener('click', tryPlay);
    window.addEventListener('touchstart', tryPlay);
  }

  ngOnDestroy() {
    this.stopRinging();
    this.removeGlobalListeners();
  }

  stopRinging() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.vibrateInterval) clearInterval(this.vibrateInterval);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(0);
  }

  startDrag(e: MouseEvent | TouchEvent) {
    this.isDragging.set(true);
  }

  private addGlobalListeners() {
    window.addEventListener('mousemove', this.handleMove);
    window.addEventListener('mouseup', this.handleEnd);
    window.addEventListener('touchmove', this.handleMove, { passive: false });
    window.addEventListener('touchend', this.handleEnd);
  }

  private removeGlobalListeners() {
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleEnd);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
  }

  private handleMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging() || !this.sliderContainer) return;
    
    const clientX = (e instanceof MouseEvent) ? e.clientX : (e as TouchEvent).touches[0].clientX;
    const rect = this.sliderContainer.nativeElement.getBoundingClientRect();
    const maxDrag = rect.width - 68 - 12; // 68 handle width, 12 padding/margin approx
    
    let x = clientX - rect.left - 34; // 34 is half handle width
    x = Math.max(0, Math.min(x, maxDrag));
    
    this.dragX.set(x);
  };

  private handleEnd = () => {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    const maxDrag = this.sliderContainer.nativeElement.getBoundingClientRect().width - 80; // approx
    
    if (this.dragX() > maxDrag * 0.75) {
      this.dragX.set(maxDrag);
      this.isAnswered.set(true);
      this.stopRinging();
      setTimeout(() => this.onAnswer.emit(), 200);
    } else {
      this.dragX.set(0);
    }
  };
}