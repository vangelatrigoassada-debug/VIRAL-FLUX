import { Component, OnInit, OnDestroy, output, signal, ViewChild, ElementRef, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { ASSETS } from '../app.assets';
import { GeminiService } from '../services/gemini.service';

interface Message {
  id: number;
  type: 'system' | 'text' | 'audio';
  text?: string;
  sender?: string;
  time?: string;
  duration?: string;
  audioUrl?: string;
}

@Component({
  selector: 'app-audio-message',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex items-center gap-3 min-w-[220px]">
        <div class="relative">
            <div 
                class="w-10 h-10 rounded-full bg-[#fa653e] flex items-center justify-center pl-1 cursor-pointer hover:bg-opacity-90 touch-manipulation"
                (click)="togglePlay($event)"
            >
                @if (isPlaying()) {
                  <app-icon name="pause" class="w-5 h-5 text-white/80 fill-current"></app-icon>
                } @else {
                  <div class="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#d1d7db] border-b-[6px] border-b-transparent ml-1"></div>
                }
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-[#202c33] rounded-full flex items-center justify-center">
                 <div class="w-3 h-3 rounded-full bg-[#00a884] border-2 border-[#202c33]"></div>
            </div>
        </div>
        <div class="flex-1 flex flex-col justify-center">
            <div class="flex items-center gap-3">
                <div class="flex-1">
                    <div class="h-1 bg-[#41515c] rounded-full w-full mb-1 relative overflow-hidden">
                        <div 
                            class="absolute top-0 left-0 h-full bg-[#b4b4b4] transition-[width] duration-100 ease-linear will-change-[width]"
                            [style.width.%]="isPlaying() ? currentProgress() : 0"
                        ></div>
                    </div>
                    <div class="flex justify-between text-[#8696a0] text-[11px] font-medium">
                        <span>{{ durationDisplay() }}</span>
                        <span class="flex items-center gap-1">{{ msg().time }}</span>
                    </div>
                </div>
                
                <button
                    (click)="changeSpeed($event)"
                    class="bg-[#202c33]/50 hover:bg-[#202c33] text-white/90 text-[10px] font-medium px-2 py-1 rounded-full border border-white/10 min-w-[34px] text-center transition-colors backdrop-blur-sm self-start -mt-1 touch-manipulation"
                >
                    {{ playbackRate() }}x
                </button>
            </div>
        </div>
    </div>
  `
})
export class AudioMessageComponent implements OnInit, OnDestroy {
    msg = input.required<Message>();
    isPlaying = input.required<boolean>();
    currentProgress = input.required<number>();
    playbackRate = input.required<number>();
    
    play = output<{id: number, url: string}>();
    speed = output<void>();

    durationDisplay = signal("--:--");
    private audioObj: HTMLAudioElement | null = null;

    ngOnInit() {
        if(this.msg().audioUrl) {
            this.audioObj = new Audio(this.msg().audioUrl);
            this.audioObj.addEventListener('loadedmetadata', () => {
                 if (this.audioObj && isFinite(this.audioObj.duration)) {
                    const mins = Math.floor(this.audioObj.duration / 60);
                    const secs = Math.floor(this.audioObj.duration % 60).toString().padStart(2, '0');
                    this.durationDisplay.set(`${mins}:${secs}`);
                 }
            });
        }
    }
    
    ngOnDestroy() {
        if(this.audioObj) {
            this.audioObj.remove();
        }
    }

    togglePlay(e: Event) {
        e.stopPropagation();
        this.play.emit({ id: this.msg().id, url: this.msg().audioUrl! });
    }

    changeSpeed(e: Event) {
        e.stopPropagation();
        this.speed.emit();
    }
}

@Component({
  selector: 'app-whatsapp-chat',
  standalone: true,
  imports: [CommonModule, IconComponent, AudioMessageComponent],
  template: `
    <div class="h-full w-full flex flex-col bg-[#0b141a] relative">
      <!-- Shield Overlay -->
      @if (showShield()) {
          <div class="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center font-mono p-6 animate-fade-in">
            <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(#0aff0a 1px, transparent 1px); background-size: 20px 20px;"></div>
            <div class="relative z-10 border border-[#0aff0a]/30 bg-black/80 p-6 rounded-2xl shadow-[0_0_50px_rgba(10,255,10,0.1)] w-full max-w-[320px]">
                <div class="flex justify-center mb-6">
                    <div class="relative">
                        <div class="absolute inset-0 bg-[#0aff0a] blur-xl opacity-20 animate-pulse"></div>
                        <app-icon name="shieldCheck" class="w-16 h-16 text-[#0aff0a] animate-bounce relative z-10"></app-icon>
                    </div>
                </div>
                <h1 class="text-[#0aff0a] text-xl font-bold tracking-widest text-center mb-2 animate-pulse">ACESSO SEGURO</h1>
                <p class="text-[#0aff0a]/70 text-[10px] text-center tracking-wider mb-6">LIBERANDO CREDENCIAIS...</p>
                
                <div class="space-y-4">
                    <div class="space-y-1">
                        <div class="flex items-center justify-between text-[#0aff0a] text-[10px]">
                            <span class="flex items-center gap-2"><app-icon name="terminal" class="w-3 h-3"></app-icon> VAGA</span>
                            <span class="animate-pulse">CONFIRMADA</span>
                        </div>
                        <div class="w-full h-1 bg-[#003300] rounded-full overflow-hidden">
                            <div class="h-full bg-[#0aff0a] w-[98%] shadow-[0_0_10px_#0aff0a]"></div>
                        </div>
                    </div>
                    <div class="space-y-1">
                         <div class="flex items-center justify-between text-[#0aff0a] text-[10px]">
                            <span class="flex items-center gap-2"><app-icon name="cpu" class="w-3 h-3"></app-icon> TOKEN</span>
                            <span>GERADO</span>
                        </div>
                        <div class="w-full h-1 bg-[#003300] rounded-full overflow-hidden">
                            <div class="h-full bg-[#0aff0a] w-[100%] animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-[#0aff0a]/20 text-[9px] text-[#00ff00]/60 space-y-1">
                    <p class="typewriter">> Gerando senha única...</p>
                    <p class="typewriter" style="animation-delay: 1s;">> Acesso concedido: VIP</p>
                </div>
            </div>
        </div>
      }

      <!-- Header -->
      <div class="bg-[#202c33] px-4 py-2 flex items-center gap-3 shadow-sm z-10">
        <div class="flex items-center text-[#00a884] -ml-2">
           <app-icon name="arrowLeft" class="w-6 h-6"></app-icon>
           <div class="w-9 h-9 rounded-full overflow-hidden ml-1 border border-white/10">
             <img [src]="avatarEvey" class="w-full h-full object-cover" />
           </div>
        </div>
        <div class="flex-1">
            <h3 class="text-white font-medium text-base">Agente Evey <app-icon name="sparkles" class="w-3 h-3 text-[#00a884] inline mb-1 ml-1"></app-icon></h3>
            <p class="text-[#8696a0] text-xs truncate">
                @if (status() === 'typing') {
                    <span class="text-[#00a884]">escrevendo...</span>
                } @else if (status() === 'recording') {
                    <span class="text-[#00a884]">gravando áudio...</span>
                } @else {
                    {{ 'visto por último hoje às ' + currentTime() }}
                }
            </p>
        </div>
        <div class="flex gap-5 text-[#00a884]">
           <app-icon name="video" class="w-6 h-6"></app-icon>
           <app-icon name="phone" class="w-5 h-5"></app-icon>
           <app-icon name="moreVertical" class="w-5 h-5 text-[#8696a0]"></app-icon>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 relative bg-[#0b141a]">
        <div class="absolute inset-0 opacity-[0.06] pointer-events-none" 
             [style.backgroundImage]="'url(' + bgImage + ')'" 
             style="background-size: 400px;"></div>
             
        <div class="absolute inset-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             <div class="space-y-2 pb-24">
               @for(msg of messages(); track msg.id) {
                 @if (msg.type === 'system') {
                    <div class="flex justify-center mb-4">
                        <div class="bg-[#1f2c34] text-[#ffd279] text-[10px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[80%] border border-[#ffd279]/10">
                            <app-icon name="lock" class="w-2.5 h-2.5 inline mr-1 -mt-0.5"></app-icon> {{ msg.text }}
                        </div>
                    </div>
                 } @else {
                    <div class="flex animate-fade-in-up" [class.justify-end]="msg.sender === 'user'" [class.justify-start]="msg.sender !== 'user'">
                        <div class="rounded-lg p-2 max-w-[80%] shadow-md min-w-[120px] text-white relative" 
                             [class.bg-[#005c4b]]="msg.sender === 'user'" 
                             [class.bg-[#202c33]]="msg.sender !== 'user'">
                            @if (msg.type === 'audio') {
                                <app-audio-message 
                                    [msg]="msg" 
                                    [isPlaying]="playingId() === msg.id" 
                                    [currentProgress]="audioProgress()"
                                    [playbackRate]="getPlaybackRate(msg.id)"
                                    (play)="handleManualPlay($event)"
                                    (speed)="togglePlaybackRate(msg.id)"
                                ></app-audio-message>
                            } @else {
                                <div class="pb-4 pr-2">
                                    <span class="text-sm">{{ msg.text }}</span>
                                    <span class="absolute bottom-1 right-2 text-[10px] text-[#8696a0] flex items-center gap-1">{{ msg.time }}</span>
                                </div>
                            }
                        </div>
                    </div>
                 }
               }
               <div #chatEnd></div>
             </div>
             
             @if (showTikTokButton()) {
                <div class="fixed bottom-32 left-0 right-0 px-6 flex justify-center animate-fade-in-up z-30">
                    <button 
                        (click)="onAccessTikTok.emit()"
                        class="bg-black text-white font-bold py-3 px-6 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(255,0,80,0.5)] border border-[#ff0050] hover:scale-105 transition-transform touch-manipulation"
                    >
                        <span class="w-2 h-2 rounded-full bg-[#00f2ea] animate-pulse"></span>
                        <span class="flex items-center gap-2"><app-icon name="wallet" class="w-4 h-4 text-[#00f2ea]"></app-icon> ACESSAR FERRAMENTA</span>
                        <span class="w-2 h-2 rounded-full bg-[#ff0050] animate-pulse"></span>
                    </button>
                </div>
             }
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="bg-[#202c33] px-2 py-1.5 flex items-end gap-2 relative z-30 min-h-[60px] pb-6">
          <div class="p-3 text-[#8696a0] mb-1"><app-icon name="plus" class="w-6 h-6"></app-icon></div>
          <div class="flex-1 bg-[#2a3942] rounded-2xl py-2.5 px-4 flex items-center justify-between mb-1.5">
             <input type="text" [value]="inputValue()" (input)="inputValue.set($any($event.target).value)" placeholder="Mensagem" class="w-full bg-transparent text-white placeholder-[#8696a0] text-[15px] outline-none border-none" disabled>
             <div class="flex gap-4 text-[#8696a0] ml-2">
                <app-icon name="camera" class="w-5 h-5"></app-icon>
             </div>
          </div>
          <button (click)="handleSendMessage()" class="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all bg-[#00a884] mb-1.5 touch-manipulation">
             <app-icon name="mic" class="w-6 h-6 fill-current"></app-icon>
          </button>
      </div>
    </div>
  `
})
export class WhatsappChatComponent implements OnInit, OnDestroy {
  onAccessTikTok = output<void>();
  geminiService = inject(GeminiService);

  avatarEvey = ASSETS.images.avatarEvey;
  bgImage = ASSETS.images.whatsappBg;
  
  messages = signal<Message[]>([
    { id: 1, type: 'system', text: '🔒 Esta conversa é criptografada pela Agente-Evey' }
  ]);
  
  status = signal<'idle' | 'recording' | 'typing'>('idle');
  inputValue = signal("");
  showShield = signal(false);
  showTikTokButton = signal(false);
  currentTime = signal("");
  
  playingId = signal<number | null>(null);
  audioProgress = signal(0);
  playbackRates = signal<Record<number, number>>({});

  private currentAudio: HTMLAudioElement | null = null;
  private isCancelled = false;
  
  @ViewChild('chatEnd') chatEnd!: ElementRef;

  ngOnInit() {
    this.currentTime.set(this.getBrasiliaTime());
    this.runSequence();
  }

  ngOnDestroy() {
    this.isCancelled = true;
    this.stopAudio();
  }

  getBrasiliaTime() {
    return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  }
  
  getPlaybackRate(id: number) {
      return this.playbackRates()[id] || 1;
  }
  
  togglePlaybackRate(id: number) {
      const current = this.playbackRates()[id] || 1;
      const rates = [1, 1.5, 2, 2.5, 3];
      const next = rates[(rates.indexOf(current) + 1) % rates.length];
      
      this.playbackRates.update(m => ({ ...m, [id]: next }));
      if (this.currentAudio && this.playingId() === id) {
          this.currentAudio.playbackRate = next;
      }
  }

  async runSequence() {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    await delay(1500); if(this.isCancelled) return;
    
    this.status.set('recording');
    await delay(1000);
    this.status.set('idle');
    
    const id1 = 2;
    this.addMsg({ id: id1, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio1 });
    await this.playAudioPromise(id1, ASSETS.audio.whatsappAudio1);
    if(this.isCancelled) return;

    await delay(2000);
    this.showShield.set(true);
    await delay(4500);
    this.showShield.set(false);

    this.status.set('recording');
    await delay(1000);
    this.status.set('idle');
    const id2 = 3;
    this.addMsg({ id: id2, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio2 });
    await this.playAudioPromise(id2, ASSETS.audio.whatsappAudio2);
    if(this.isCancelled) return;
    
    // Condensed sequence for brevity but keeping narrative
    this.status.set('recording');
    await delay(500);
    this.status.set('idle');
    const id3 = 4;
    this.addMsg({ id: id3, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio3 });
    await this.playAudioPromise(id3, ASSETS.audio.whatsappAudio3);

    this.status.set('recording');
    await delay(500);
    this.status.set('idle');
    const id4 = 5;
    this.addMsg({ id: id4, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio4 });
    await this.playAudioPromise(id4, ASSETS.audio.whatsappAudio4);

    this.status.set('recording');
    await delay(500);
    this.status.set('idle');
    const id5 = 6;
    this.addMsg({ id: id5, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio5 });
    await this.playAudioPromise(id5, ASSETS.audio.whatsappAudio5);

    await delay(500); this.status.set('typing'); await delay(1500); this.status.set('idle');
    this.addMsg({ id: 7, type: 'text', sender: 'Agente Evey', time: this.getBrasiliaTime(), text: "⚠️ O sistema abriu uma exceção rara para o seu ID." });

    await delay(500); this.status.set('typing'); await delay(1500); this.status.set('idle');
    this.addMsg({ id: 8, type: 'text', sender: 'Agente Evey', time: this.getBrasiliaTime(), text: "USE ESTA SENHA PARA SACAR:" });

    await delay(500); this.status.set('typing'); await delay(1500); this.status.set('idle');
    this.addMsg({ id: 9, type: 'text', sender: 'Agente Evey', time: this.getBrasiliaTime(), text: "🔑 Vingança2026" });

    await delay(1000); this.status.set('recording'); await delay(1500); this.status.set('idle');
    const id6 = 10;
    this.addMsg({ id: id6, type: 'audio', sender: 'Agente Evey', time: this.getBrasiliaTime(), duration: '...', audioUrl: ASSETS.audio.whatsappAudio6 });
    await this.playAudioPromise(id6, ASSETS.audio.whatsappAudio6);

    await delay(500);
    this.showTikTokButton.set(true);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  addMsg(msg: Message) {
      this.messages.update(msgs => [...msgs, msg]);
      setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
      try {
        this.chatEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      } catch(e) {}
  }

  stopAudio() {
    if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
    }
    this.playingId.set(null);
    this.audioProgress.set(0);
  }

  playAudioPromise(id: number, url: string) {
      return new Promise<void>(resolve => {
          this.handleManualPlay({id, url});
          
          if (!this.currentAudio) {
              resolve();
              return;
          }

          const audio = this.currentAudio;
          const finish = () => {
              if (this.currentAudio === audio) {
                  this.playingId.set(null);
                  this.audioProgress.set(0);
                  this.currentAudio = null;
              }
              resolve();
          };

          audio.onended = finish;
          audio.onerror = () => {
              console.warn("Audio playback error");
              finish();
          };
          
          // Safety timeout for blocked autoplay
          setTimeout(() => {
              if (audio.paused && audio.currentTime === 0 && this.currentAudio === audio) {
                  console.warn("Audio seems blocked, skipping");
                  finish();
              }
          }, 2000);
      });
  }

  handleManualPlay(event: {id: number, url: string}) {
      if(this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio = null;
          if(this.playingId() === event.id) {
              this.playingId.set(null);
              this.audioProgress.set(0);
              return;
          }
      }
      
      this.currentAudio = new Audio(event.url);
      this.currentAudio.playbackRate = this.getPlaybackRate(event.id);
      this.playingId.set(event.id);
      
      this.currentAudio.ontimeupdate = () => {
          if(this.currentAudio && this.currentAudio.duration) {
              this.audioProgress.set((this.currentAudio.currentTime / this.currentAudio.duration) * 100);
          }
      };
      
      this.currentAudio.onended = () => {
          this.playingId.set(null);
          this.audioProgress.set(0);
          this.currentAudio = null;
      };
      
      this.currentAudio.play().catch(() => {});
  }

  async handleSendMessage() {
    const txt = this.inputValue().trim();
    if (!txt) return;

    this.addMsg({ id: Date.now(), type: 'text', text: txt, sender: 'user', time: this.getBrasiliaTime() });
    this.inputValue.set("");
    this.status.set('typing');
    
    const response = await this.geminiService.generateText(txt, "Você é a 'Agente Evey'. Responda curto e direto sobre como ganhar dinheiro com o app. Fale em Português.");
    this.status.set('idle');
    
    if (response) {
       this.addMsg({ id: Date.now() + 1, type: 'text', text: response, sender: 'Agente Evey', time: this.getBrasiliaTime() });
    }
  }
}
