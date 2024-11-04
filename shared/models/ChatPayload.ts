import { ChatEvent } from './ChatEvent.ts';

export class ChatPayload {
  private event: string;
  private message: string;

  private constructor(event: string, message: string) {
    this.event = event;
    this.message = message;
  }

  static createFromMessageEvent(messageEvent: MessageEvent) {
    const data = JSON.parse(messageEvent.data);

    return new ChatPayload(data.event, data.message);
  }

  public isFromCustomer(): boolean {
    return this.event == ChatEvent.FromCustomer;
  }

  public isFromCustomerServiceAgent(): boolean {
    return this.event == ChatEvent.FromCustomerServiceAgent;
  }

  public getMessage(): string {
    return this.message;
  }
}
