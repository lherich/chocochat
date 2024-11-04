import { ChatEvent } from './ChatEvent.ts';

export class ChatMessage {
  private content: string;
  private datetime: string;
  private event: ChatEvent;

  public constructor(event: ChatEvent, content: string) {
    this.event = event;
    this.content = content;
    this.datetime = new Date().toLocaleTimeString('de');
  }

  static fromCustomer(content: string): ChatMessage {
    return new ChatMessage(ChatEvent.FromCustomer, content);
  }

  static fromCustomerServiceAgent(content: string): ChatMessage {
    return new ChatMessage(ChatEvent.FromCustomerServiceAgent, content);
  }

  static broadcast(content: string): ChatMessage {
    return new ChatMessage(ChatEvent.Broadcast, content);
  }

  public getMessage(): string {
    return this.content;
  }

  public isFromCustomer(): boolean {
    return this.event == ChatEvent.FromCustomer;
  }

  public stringify(): string {
    return JSON.stringify({
      event: this.event,
      content: this.content,
      datetime: this.datetime,
    });
  }
}
