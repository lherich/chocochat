import {
  ChatMessage,
  ChatPayload,
  ChatSession,
  Customer,
  CustomerServiceAgent,
} from '@scope/shared';
import { OpenAI } from 'https://deno.land/x/openai@v4.68.1/mod.ts';

export default class ChatServer {
  private connectedClients = new Map<string, ChatSession>();

  public handle(uuid: string, socket: WebSocket, openai: OpenAI) {
    socket.onopen = () => this.start(uuid, socket, openai);
    socket.onclose = () => this.close(uuid);
    socket.onmessage = (event: MessageEvent) => this.event(uuid, event);
  }

  private start(uuid: string, socket: WebSocket, openai: OpenAI) {
    console.log(uuid + ': websocket start');

    if (this.connectedClients.has(uuid)) {
      return;
    }

    const chatSession = new ChatSession(new Customer(socket));
    chatSession.addCustomerServiceAgent(
      new CustomerServiceAgent(chatSession, openai),
    );

    this.connectedClients.set(
      uuid,
      chatSession,
    );

    chatSession.send(
      ChatMessage.fromCustomerServiceAgent('Hey, how can I assist you?'),
    );
  }

  private event(uuid: string, event: MessageEvent) {
    console.log(uuid + ': message income');

    if (!this.connectedClients.has(uuid)) {
      console.log(uuid + ': unkown chat session');
      return;
    }

    const chatPayload: ChatPayload = ChatPayload.createFromMessageEvent(event);
    const chatSession: ChatSession = this.connectedClients.get(
      uuid,
    ) as ChatSession;

    if (chatPayload.isFromCustomer()) {
      chatSession.send(ChatMessage.fromCustomer(chatPayload.getMessage()));
      return;
    }
    if (chatPayload.isFromCustomerServiceAgent()) {
      chatSession.send(
        ChatMessage.fromCustomerServiceAgent(chatPayload.getMessage()),
      );
      return;
    }

    chatSession.send(ChatMessage.broadcast(chatPayload.getMessage()));
  }

  private close(uuid: string) {
    console.log(uuid + ': websocket close');

    this.connectedClients.delete(uuid);
  }
}
