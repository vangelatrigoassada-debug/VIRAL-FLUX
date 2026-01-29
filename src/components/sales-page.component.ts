import { Component } from '@angular/core';
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

        <!-- Video Placeholder -->
        <div class="aspect-video bg-black rounded-xl relative overflow-hidden shadow-xl group cursor-pointer border-4 border-gray-100">
             <div class="absolute inset-0 flex items-center justify-center z-10">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                    <app-icon name="play" class="w-8 h-8 text-white fill-current ml-1"></app-icon>
                </div>
             </div>
             <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop" class="w-full h-full object-cover opacity-60" />
             <div class="absolute bottom-4 left-4 right-4 text-white text-xs font-bold text-center text-shadow">
                 ASSISTA O VÍDEO EXPLICATIVO ANTES DE COMPRAR
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
export class SalesPageComponent {}