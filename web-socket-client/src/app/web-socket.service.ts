import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject: Subject<any> = new Subject<any>();
  private readonly serverUrl: string = 'ws://172.23.224.104/ws';

  constructor() {}

  private createWebSocketConnection(): void {
    this.socket = new WebSocket(this.serverUrl);

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = () => {
      this.messageSubject.next('Connection Closed');
      this.socket = null;
    };
  }

  public connect(): void {
    if (!this.socket) {
      this.createWebSocketConnection();
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  public sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log('Message sent: ' + message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  public getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}