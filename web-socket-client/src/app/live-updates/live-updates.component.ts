import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-live-updates',
  imports: [NgFor, NgForOf],
  templateUrl: './live-updates.component.html',
  styleUrl: './live-updates.component.css'
})
export class LiveUpdatesComponent {
  private messageSubscription!: Subscription;
  public messages: any[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.connect();
    this.messageSubscription = this.webSocketService.getMessages().subscribe((message) => {
      console.log(message);
      var messageText: string = message;
      
      if (messageText == 'Connection Estabilished') {
        this.webSocketService.sendMessage('Live-Updates');
      }
      if (messageText.includes('Flight-Tracker')) {
      }
      else {
        this.messages.push(message);
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

  CloseConnection(){
    this.webSocketService.close();
  }

  OpenConnection(){
    this.webSocketService.connect();
  }
}
