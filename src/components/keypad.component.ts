import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="h-full w-full bg-black flex flex-col py-8 px-6">
      <div class="flex-1 flex flex-col items-center justify-center mb-8">
        <div class="text-white text-4xl tracking-widest mb-2 h-12">
          {{ formattedInput() }}
        </div>
        <p class="text-[#34C759] text-sm animate-pulse">Conexão Segura Estabelecida</p>
      </div>
      
      <div class="w-full max-w-[320px] mx-auto grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
        @for(k of keys; track k) {
          <button (click)="handleKey(k)" class="w-[72px] h-[72px] rounded-full bg-[#333333] flex flex-col items-center justify-center active:bg-[#555] transition-colors touch-manipulation">
            <span class="text-white text-3xl font-light">{{ k }}</span>
          </button>
        }
      </div>
      
      <div class="flex justify-center items-center gap-8 mb-8">
        <div class="w-[72px]"></div>
        <button (click)="onCall.emit()" class="w-[72px] h-[72px] rounded-full bg-[#34C759] flex items-center justify-center transform active:scale-95 transition-all touch-manipulation">
           <app-icon name="phone" class="w-8 h-8 text-white fill-current"></app-icon>
        </button>
        <button (click)="deleteChar()" class="w-[72px] flex justify-center text-gray-400 touch-manipulation">
           <app-icon name="arrowLeft" class="w-6 h-6"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class KeypadComponent {
  onCall = output<void>();
  input = signal("52679588");
  keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];

  handleKey(k: string) {
    if (this.input().length < 12) {
      this.input.update(v => v + k);
    }
  }

  deleteChar() {
    this.input.update(v => v.slice(0, -1));
  }

  formattedInput() {
    const v = this.input();
    // Simulate regex: v.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3')
    if (v.length >= 11) {
       return v.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
    }
    return v;
  }
}