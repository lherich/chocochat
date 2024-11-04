import { ChatMessage } from './ChatMessage.ts';

export class Customer {
  private socket: WebSocket;

  public constructor(socket: WebSocket) {
    this.socket = socket;
  }

  public send(message: ChatMessage) {
    this.socket.send(message.stringify());
  }
}
