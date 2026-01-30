import { Component, OnInit, OnDestroy, AfterViewInit, output, signal, ViewChild, ElementRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { ASSETS } from '../app.assets';

@Component({
    selector: 'app-tiktok-video',
    standalone: true,
    template: `
     <div class="absolute inset-0 w-full h-full bg-black select-none" (contextmenu)="$event.preventDefault()">
        <video 
            #videoRef
            [src]="optimizedSrc()" 
            class="w-full h-full object-cover pointer-events-none"
            playsinline
            webkit-playsinline="true"
            x5-playsinline="true"
            [preload]="preloadStrategy()"
            disablePictureInPicture
            disableRemotePlayback
            (ended)="handleEnded()"
        ></video>
        
        @if (showButton()) {
            <div class="absolute inset-0 z-50 flex items-center justify-center animate-fade-in bg-black/40 backdrop-blur-[2px]">
                <button 
                    (click)="accessTool.emit()"
                    class="bg-[#00f2ea] hover:bg-[#00c2bb] text-black font-extrabold py-4 px-8 rounded-full shadow-[0_0_30px_rgba(0,242,234,0.6)] animate-bounce transform hover:scale-110 transition-all border-2 border-white uppercase tracking-wider text-sm sm:text-base pointer-events-auto cursor-pointer"
                >
                    Acessar a ferramenta
                </button>
            </div>
        }
     </div>
    `
})
export class TikTokVideoComponent implements AfterViewInit {
    src = input.required<string>();
    isActive = input.required<boolean>();
    shouldPreload = input<boolean>(false);
    ended = output<void>();
    accessTool = output<void>();

    @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;
    showButton = signal(false);

    // Otimização agressiva: q_auto:eco reduz drasticamente o bitrate para carregar instantâneo
    optimizedSrc = computed(() => {
        const url = this.src();
        if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
            return url.replace('/upload/', '/upload/q_auto:eco,f_auto,w_720/');
        }
        return url;
    });

    preloadStrategy = computed(() => {
        // Force auto preload if active or next in line to prevent lag
        if (this.isActive()) return 'auto';
        if (this.shouldPreload()) return 'auto';
        return 'metadata';
    });

    ngAfterViewInit() {
        // Tenta reproduzir assim que o componente for criado se ele já for o ativo (caso do 1º vídeo)
        if (this.isActive()) {
            this.handlePlayback();
        }
    }

    ngOnChanges() {
        // Reage a mudanças de slide
        if (this.videoRef) {
            this.handlePlayback();
        }
    }

    async handlePlayback() {
        const video = this.videoRef.nativeElement;
        
        if (this.isActive()) {
            this.showButton.set(false);
            
            try {
                video.currentTime = 0;
                // Tenta tocar COM som primeiro
                video.muted = false;
                await video.play();
            } catch (error) {
                console.warn('Autoplay unmuted blocked, falling back to muted:', error);
                // SE falhar (bloqueio do browser), ativa o mudo e toca imediatamente
                // Isso impede que o vídeo fique "congelado"
                video.muted = true;
                try {
                    await video.play();
                } catch (e) {
                    console.error("Video playback completely failed", e);
                }
            }
        } else {
            video.pause();
            video.currentTime = 0;
            this.showButton.set(false);
        }
    }

    handleEnded() {
        this.showButton.set(true);
        this.ended.emit();
    }
}

@Component({
  selector: 'app-tiktok-feed',
  standalone: true,
  imports: [CommonModule, IconComponent, TikTokVideoComponent],
  template: `
    <div class="h-full w-full bg-black text-white font-sans relative overflow-hidden">
        <div 
            #container
            (scroll)="handleScroll($event)"
            class="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        >
            @for(post of posts; track post.id; let i = $index) {
                <div class="h-full w-full snap-start relative bg-gray-900 flex items-center justify-center border-b border-gray-800 overflow-hidden">
                   <!-- Only render video component if it's close to viewport to save memory -->
                   @if (i >= activeIndex() - 1 && i <= activeIndex() + 1) {
                       <app-tiktok-video 
                          [src]="post.videoUrl"
                          [isActive]="activeIndex() === i"
                          [shouldPreload]="i === activeIndex() + 1"
                          (ended)="scrollToNext(i)"
                          (accessTool)="onAccessTool.emit()"
                       ></app-tiktok-video>
                   }

                   <!-- Gradient Overlay -->
                   <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>

                   <!-- UI Controls -->
                   <div class="absolute right-2 bottom-20 flex flex-col items-center gap-6 z-20">
                        <div class="relative">
                            <div class="w-12 h-12 rounded-full border border-white p-[1px]">
                                <img [src]="avatarV" class="w-full h-full rounded-full object-cover" />
                            </div>
                            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full p-0.5"><app-icon name="plus" class="w-3 h-3 text-white"></app-icon></div>
                        </div>
                        <div class="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90 touch-manipulation" (click)="toggleLike(post.id)">
                            <app-icon name="heart" class="w-8 h-8 transition-colors duration-300" [class.fill-red-500]="isLiked(post.id)" [class.text-red-500]="isLiked(post.id)" [class.fill-white]="!isLiked(post.id)"></app-icon>
                            <span class="text-xs font-semibold">{{ post.likes }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-1 cursor-pointer touch-manipulation" (click)="showComments.set(true)">
                            <app-icon name="messageCircle" class="w-8 h-8 fill-white text-white"></app-icon>
                            <span class="text-xs font-semibold">{{ comments().length }}</span>
                        </div>
                        <div class="flex flex-col items-center gap-1"><app-icon name="bookmark" class="w-8 h-8 fill-white text-white"></app-icon><span class="text-xs font-semibold">{{ post.saves }}</span></div>
                        <div class="flex flex-col items-center gap-1"><app-icon name="share2" class="w-8 h-8 fill-white text-white"></app-icon><span class="text-xs font-semibold">Share</span></div>
                        <div class="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center animate-spin-slow"><app-icon name="disc" class="w-6 h-6"></app-icon></div>
                    </div>
                    
                    <div class="absolute left-4 bottom-20 z-20 w-3/4">
                        <h3 class="font-bold text-shadow-sm mb-2">@agente_Vinganca</h3>
                        <p class="text-sm text-shadow-sm mb-2">{{ post.desc }}</p>
                        <div class="flex items-center gap-2"><app-icon name="music" class="w-3 h-3"></app-icon><span class="text-xs scrolling-text">Som original - Viralizou</span></div>
                    </div>
                </div>
            }
        </div>

        @if (showComments()) {
            <div class="absolute bottom-0 left-0 right-0 h-[70%] bg-[#161823] rounded-t-xl z-40 flex flex-col animate-slide-up shadow-2xl border-t border-gray-800">
                <div class="flex justify-between items-center p-4 border-b border-gray-800">
                    <div class="w-4"></div>
                    <span class="text-sm font-bold">{{ comments().length }} comentários</span>
                    <app-icon name="x" class="w-5 h-5 cursor-pointer text-gray-400 touch-manipulation" (click)="showComments.set(false)"></app-icon>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-5">
                    @for(c of comments(); track c.id) {
                        <div class="flex gap-3">
                            <div class="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                               <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + c.user" class="w-full h-full bg-gray-600" alt="user" />
                            </div>
                            <div class="flex-1">
                                <p class="text-xs text-gray-400 font-semibold mb-0.5">{{ c.user }}</p>
                                <p class="text-sm text-white/90 leading-tight">{{ c.text }}</p>
                                <div class="flex gap-4 mt-1.5 text-[11px] text-gray-500 font-medium"><span>{{ c.time }}</span><span class="cursor-pointer hover:text-gray-300">Responder</span></div>
                            </div>
                            <div class="flex flex-col items-center gap-1 mt-1">
                                <app-icon name="heart" class="w-4 h-4 cursor-pointer transition-colors" [class.text-red-500]="isCommentLiked(c.id)" [class.fill-red-500]="isCommentLiked(c.id)" (click)="toggleCommentLike(c.id)"></app-icon>
                                <span class="text-[10px] text-gray-500">{{ c.likes + (isCommentLiked(c.id) ? 1 : 0) }}</span>
                            </div>
                        </div>
                    }
                </div>
                <div class="p-3 border-t border-gray-800 flex gap-3 items-center bg-[#161823]">
                    <div class="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0 border border-gray-600"><img [src]="avatarV" class="w-full h-full object-cover" /></div>
                    <div class="flex-1 relative"><input type="text" placeholder="Adicionar comentário..." class="w-full bg-[#252525] rounded-full py-2.5 px-4 text-sm focus:outline-none text-white placeholder-gray-500" /><div class="absolute right-3 top-2.5 flex gap-2 text-gray-400"><span class="text-xs font-bold">@</span></div></div>
                </div>
            </div>
        }

        <!-- Footer -->
        <div class="absolute bottom-0 w-full bg-black border-t border-gray-800 flex justify-between items-center py-2 px-4 z-30">
            <div class="flex flex-col items-center gap-1 opacity-100"><app-icon name="home" class="w-6 h-6 fill-white"></app-icon><span class="text-[10px]">Início</span></div>
            <div class="flex flex-col items-center gap-1 opacity-50"><app-icon name="users" class="w-6 h-6"></app-icon><span class="text-[10px]">Amigos</span></div>
            <div class="w-12 h-8 bg-white rounded-lg flex items-center justify-center relative">
               <div class="absolute left-[2px] right-[2px] top-0 bottom-0 bg-black rounded-md flex items-center justify-center"><app-icon name="plus" class="w-5 h-5 text-white"></app-icon></div>
               <div class="absolute -left-1 w-1 h-full bg-[#00f2ea] rounded-l-lg -z-10"></div>
               <div class="absolute -right-1 w-1 h-full bg-[#ff0050] rounded-r-lg -z-10"></div>
            </div>
            <div class="flex flex-col items-center gap-1 opacity-50"><app-icon name="messageCircle" class="w-6 h-6"></app-icon><span class="text-[10px]">Entrada</span></div>
            <div class="flex flex-col items-center gap-1 opacity-50"><div class="w-6 h-6 rounded-full border border-white overflow-hidden"><img [src]="avatarV" class="w-full h-full object-cover" /></div><span class="text-[10px]">Perfil</span></div>
        </div>
    </div>
  `
})
export class TikTokFeedComponent {
    onAccessTool = output<void>();
    avatarV = ASSETS.images.avatarV;

    activeIndex = signal(0);
    showComments = signal(false);
    
    likedPosts = signal<Record<number, boolean>>({});
    likedComments = signal<Record<number, boolean>>({});
    
    @ViewChild('container') container!: ElementRef<HTMLDivElement>;

    posts = [
        { id: 1, videoUrl: "https://res.cloudinary.com/drcxtjbox/video/upload/v1769622022/EDIT-TIKTOK_VIDEO_1_x0bjml.mp4", desc: "A verdade que o governo esconde de você... 🚫👁️ #sistema #revelado #vinganca2026", likes: "52K", saves: "12K" },
        { id: 2, videoUrl: "https://res.cloudinary.com/drcxtjbox/video/upload/v1769623060/Video_2_Editado_TIKTOK_soazbl.mp4", desc: "Eles não querem que você saiba desse aplicativo secreto 🤫📱 #vazou #apppagando", likes: "150K", saves: "30K" },
        { id: 3, videoUrl: "https://res.cloudinary.com/drcxtjbox/video/upload/v1769640870/tiktokpraiaVideo3_btpdjp.mp4", desc: "Mudei de vida em 2 semanas usando apenas o celular. Obrigado Evey! 🙏 #gratidao", likes: "21K", saves: "501" },
        { id: 4, videoUrl: "https://res.cloudinary.com/drcxtjbox/video/upload/v1769691504/Video_4_TikTOK_EDITADOPRAIA_rqhbld.mp4", desc: "Novo vídeo exclusivo liberado! 🚀 #oportunidade #rendaextra", likes: "10K", saves: "2K" },
        { id: 5, videoUrl: "https://res.cloudinary.com/drcxtjbox/video/upload/v1769697908/VIDEOTIKTOK5_final_up5kjs.mp4", desc: "Mais um aluno tendo resultados incríveis! 🚀 #rendaextra #liberdade", likes: "8.5K", saves: "1.1K" },
    ];

    comments = signal(this.generateComments());

    generateComments() {
        const names = ['pedro', 'ana', 'lucas', 'mari', 'joao', 'sofia', 'carlos', 'bia', 'rafa', 'gui', 'julia', 'bruno', 'carol', 'diego', 'fernanda', 'gabriel', 'helena', 'igor', 'jessica', 'kaique', 'larissa', 'marcos', 'natalia', 'otavio', 'patricia', 'renan', 'sabrina', 'thiago', 'vanessa', 'wesley', 'andre', 'bianca', 'caio', 'dani', 'edu', 'fabi', 'gustavo', 'hugo', 'isabela', 'jonas', 'karen', 'leo', 'monica', 'nathan', 'olivia', 'paulo', 'quel', 'ricardo', 'sara', 'tom', 'ursula', 'vitor', 'will', 'yuri', 'zeca'];
        const suffixes = ['.mkt', '_pro', '123', '.oficial', '_digital', '.vendas', '99', '.br', '_insta', '.biz', '_empreender', '.automacao', '_ia', '.bot', '_tech'];
        const feedbackTemplates = [
            "Sem palavras, consegui automatizar meu instagram em menos de 1 hora! 🚀",
            "O template do ManyChat é surreal, API oficial mesmo, zero bloqueios até agora! 🙏",
            "Eu pagava uma fortuna em outras ferramentas, esse método com a API oficial é muito melhor.",
            "Cancelei minha assinatura cara hoje mesmo. O template salva demais e é livre de bloqueios.",
            "Configurei o direct automático e minhas vendas triplicaram. Instalação em 40min.",
            "O Agente de I.A conversa igual humano, chocado! E não precisa pagar nada a mais.",
            "Respostas ilimitadas de verdade, meu engajamento subiu muito com a API oficial.",
            "Melhor investimento! Instalei rapidinho, em menos de 2 horas tava tudo rodando.",
            "Segurança total com a API do Instagram, dormindo tranquilo sem medo de cair a conta.",
            "Não precisa ser expert, o template já vem pronto. Só pluguei e funcionou.",
            "Achei que ia demorar, mas em 1h já tava respondendo comentários no automático.",
            "Economia gigante no final do mês sem pagar mensalidade de ferramenta.",
            "Livre de bloqueios mesmo, testei pesado aqui e a API oficial aguentou tudo.",
            "O Agente de IA é muito inteligente, fecha venda sozinho no direct.",
            "Instalação vapt-vupt, muito fluido. Recomendo demais!"
        ];
        
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            user: `${names[Math.floor(Math.random() * names.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
            text: feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)],
            time: `${Math.floor(Math.random() * 59) + 1}m`,
            likes: Math.floor(Math.random() * 1500) + 10
        }));
    }

    handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        const index = Math.round(target.scrollTop / target.clientHeight);
        if (index !== this.activeIndex()) {
            this.activeIndex.set(index);
        }
    }

    scrollToNext(currentIndex: number) {
        if (currentIndex < this.posts.length - 1) {
             const nextIndex = currentIndex + 1;
             const scrollHeight = this.container.nativeElement.clientHeight;
             this.container.nativeElement.scrollTo({
                 top: nextIndex * scrollHeight,
                 behavior: 'smooth'
             });
        }
    }

    isLiked(id: number) { return !!this.likedPosts()[id]; }
    toggleLike(id: number) { this.likedPosts.update(p => ({...p, [id]: !p[id]})); }

    isCommentLiked(id: number) { return !!this.likedComments()[id]; }
    toggleCommentLike(id: number) { this.likedComments.update(p => ({...p, [id]: !p[id]})); }
}