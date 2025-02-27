import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  imports:[NgFor, NgForOf],
  styleUrls: ['./component1.component.css']
})
export class Component1Component implements OnInit, OnDestroy {
  private messageSubscription!: Subscription;
  public messages: any[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.messageSubscription = this.webSocketService.getMessages().subscribe((message) => {
      this.messages.push(message);
      if(message == 'Connection Estabilished') {  
        this.webSocketService.sendMessage('Updates');
      }
    });
    
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  sendMessage(message: string): void {
    this.webSocketService.sendMessage(message);
    alert(message);
  }

  GetMessage(): any[] {
    return this.messages.reverse();
  }
}
