import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ASSETS } from './app.assets';
import { IconComponent } from './components/icon.component';

// Import all sub-components
import { IncomingCallComponent } from './components/incoming-call.component';
import { ActiveCallComponent } from './components/active-call.component';
import { HackedScreenComponent } from './components/hacked.component';
import { KeypadComponent } from './components/keypad.component';
import { OutgoingCallComponent } from './components/outgoing-call.component';
import { WhatsappIntroComponent } from './components/whatsapp-intro.component';
import { LockScreenComponent } from './components/lock-screen.component';
import { WhatsappChatComponent } from './components/whatsapp-chat.component';
import { TikTokSecretComponent } from './components/tiktok-secret.component';
import { TikTokFeedComponent } from './components/tiktok-feed.component';
import { SalesPageComponent } from './components/sales-page.component';

type Step = 'incoming-v' | 'active-v' | 'hacked' | 'keypad' | 'outgoing-call' | 'active-evey' | 'whatsapp-intro' | 'lock-screen' | 'whatsapp-chat' | 'tiktok-secret' | 'tiktok-feed' | 'sales-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    IconComponent,
    IncomingCallComponent,
    ActiveCallComponent,
    HackedScreenComponent,
    KeypadComponent,
    OutgoingCallComponent,
    WhatsappIntroComponent,
    LockScreenComponent,
    WhatsappChatComponent,
    TikTokSecretComponent,
    TikTokFeedComponent,
    SalesPageComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  step = signal<Step>('incoming-v');
  assets = ASSETS;
  
  // Dynamic time for Status Bar
  time = signal("");

  stepsOrder: Step[] = [
    'incoming-v',
    'active-v',
    'hacked',
    'keypad',
    'outgoing-call',
    'active-evey',
    'whatsapp-intro',
    'lock-screen',
    'whatsapp-chat',
    'tiktok-secret',
    'tiktok-feed',
    'sales-page'
  ];

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.setVh();
    window.addEventListener('resize', () => this.setVh());
  }

  updateTime() {
    this.time.set(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }));
  }

  setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  next() {
    const idx = this.stepsOrder.indexOf(this.step());
    const next = this.stepsOrder[(idx + 1) % this.stepsOrder.length];
    this.step.set(next);
  }

  prev() {
    const idx = this.stepsOrder.indexOf(this.step());
    const prev = this.stepsOrder[(idx - 1 + this.stepsOrder.length) % this.stepsOrder.length];
    this.step.set(prev);
  }
}