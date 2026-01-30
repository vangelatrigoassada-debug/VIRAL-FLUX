import { Component, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-white flex flex-col overflow-y-auto font-sans">
      <!-- Header -->
      <div class="bg-[#FE2C55] text-white p-3 text-center font-bold text-xs uppercase tracking-wider sticky top-0 z-50 shadow-md">
        ⚠️ Vagas Limitadas: Liberação Imediata
      </div>
      
      <div class="p-6 flex flex-col gap-6">
        <!-- Headline -->
        <div class="text-center">
          <h1 class="text-2xl font-black text-gray-900 leading-tight mb-2 uppercase">
            O Segredo dos <span class="text-[#FE2C55]">Automatizadores</span> Revelado
          </h1>
          <p class="text-gray-600 text-sm font-medium">
            Copie e cole o Template Oficial da API do Instagram e comece a lucrar em menos de 1 hora.
          </p>
        </div>

        <!-- Video Player -->
        <div 
            class="aspect-video bg-black rounded-xl relative overflow-hidden shadow-xl border-4 border-gray-100 group"
            (mouseenter)="isHovering.set(true)" 
            (mouseleave)="isHovering.set(false)"
        >
             <video 
                #videoPlayer
                class="w-full h-full object-cover cursor-pointer"
                playsinline
                webkit-playsinline
                loop
                (click)="togglePlay()"
                poster="https://res.cloudinary.com/drcxtjbox/video/upload/so_0,q_auto,f_auto/v1769798106/video_site._kc5sz4.jpg"
                src="https://res.cloudinary.com/drcxtjbox/video/upload/q_auto,f_auto,vc_auto/v1769798106/video_site._kc5sz4.mp4">
             </video>

             <!-- Custom Play/Pause Button -->
             <div 
                class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                [class.opacity-0]="isPlaying() && !isHovering()"
                [class.opacity-100]="!isPlaying() || isHovering()"
             >
                <button 
                    (click)="togglePlay()"
                    class="pointer-events-auto bg-black/40 hover:bg-[#FE2C55] text-white rounded-full w-16 h-16 flex items-center justify-center backdrop-blur-sm border-2 border-white/20 shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                >
                    <app-icon [name]="isPlaying() ? 'pause' : 'play'" class="w-8 h-8 fill-current"></app-icon>
                </button>
             </div>
        </div>

        <!-- Offer Box -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
            <h3 class="font-bold text-lg mb-4 text-center text-gray-800">O QUE VOCÊ VAI RECEBER:</h3>
            <ul class="space-y-3 text-sm text-gray-700 font-medium">
                <li class="flex gap-2 items-center"><app-icon name="checkCircle" class="w-5 h-5 text-green-500 shrink-0 fill-green-100"></app-icon> <span>Template de manyChat com API OFICIAL do IG + Agente de I.A</span></li>
                <li class="flex gap-2 items-center"><app-icon name="checkCircle" class="w-5 h-5 text-green-500 shrink-0 fill-green-100"></app-icon> <span>Agente de I.A que sobe campanhas no facebook ads</span></li>
                <li class="flex gap-2 items-center"><app-icon name="checkCircle" class="w-5 h-5 text-green-500 shrink-0 fill-green-100"></app-icon> <span>Agente de I.A que Otimiza campanhas com Chat GPT</span></li>
                <li class="flex gap-2 items-center"><app-icon name="checkCircle" class="w-5 h-5 text-green-500 shrink-0 fill-green-100"></app-icon> <span>Verifica saldos de pix no facebook ads e avisa no Whatsapp</span></li>
            </ul>
        </div>

        <!-- Price & CTA -->
        <div class="text-center space-y-1 py-4 bg-white rounded-xl">
            <p class="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Oferta Exclusiva</p>
            <p class="text-gray-400 text-sm line-through">De R$ 497,00 por apenas</p>
            <p class="text-5xl font-black text-[#00C853] tracking-tighter">12x R$ 9,74</p>
            <p class="text-gray-500 text-xs font-medium">ou R$ 97,00 à vista</p>
            
            <a 
                href="https://checkout.ticto.app/O411A516B" 
                target="_blank"
                class="w-full bg-[#00C853] hover:bg-[#009624] text-white font-black py-4 rounded-lg text-lg shadow-[0_10px_20px_rgba(0,200,83,0.3)] transition-transform active:scale-95 animate-pulse mt-4 flex items-center justify-center gap-2 uppercase tracking-wide border-b-4 border-[#009624]"
            >
                <app-icon name="wallet" class="w-6 h-6"></app-icon> COMPRAR AGORA
            </a>
            <div class="flex justify-center items-center gap-4 text-gray-400 text-[10px] mt-4 font-medium uppercase tracking-wider">
                <span class="flex items-center gap-1"><app-icon name="lock" class="w-3 h-3"></app-icon> Compra Segura</span>
                <span class="flex items-center gap-1"><app-icon name="star" class="w-3 h-3 fill-current"></app-icon> Garantia de 7 dias</span>
            </div>
        </div>
      </div>
    </div>
  `
})
export class SalesPageComponent implements AfterViewInit {
    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    
    isPlaying = signal(false);
    isHovering = signal(false);

    ngAfterViewInit() {
        this.attemptAutoplay();
    }

    attemptAutoplay() {
        const video = this.videoPlayer.nativeElement;
        // Tenta reproduzir com som primeiro (já que o usuário clicou para chegar aqui)
        video.muted = false;
        video.play().then(() => {
            this.isPlaying.set(true);
        }).catch(() => {
            // Se bloquear, tenta mudo
            console.log('Autoplay com som bloqueado, tentando mudo');
            video.muted = true;
            video.play().then(() => {
                this.isPlaying.set(true);
            }).catch(e => {
                console.error('Autoplay falhou:', e);
                this.isPlaying.set(false);
            });
        });

        // Sincroniza estado caso controles nativos (sistema) interfiram
        video.addEventListener('play', () => this.isPlaying.set(true));
        video.addEventListener('pause', () => this.isPlaying.set(false));
    }

    togglePlay() {
        const video = this.videoPlayer.nativeElement;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}
