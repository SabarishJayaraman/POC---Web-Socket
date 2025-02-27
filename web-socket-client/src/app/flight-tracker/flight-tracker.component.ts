import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-flight-tracker',
  imports: [NgFor, NgForOf],
  templateUrl: './flight-tracker.component.html',
  styleUrl: './flight-tracker.component.css'
})
export class FlightTrackerComponent {
  private messageSubscription!: Subscription;
  public messages: any[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    //  setTimeout(() => {
    //   ()=>{}
    //  }, 20000);
     this.webSocketService.connect();
     this.messageSubscription = this.webSocketService.getMessages().subscribe((message) => {
      var messageText: String = message;
      
      if (messageText == 'Connection Estabilished') {
        this.webSocketService.sendMessage('Flight-Tracker');
      }
      
      if (messageText.includes('Live-Updates')) {
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
}
