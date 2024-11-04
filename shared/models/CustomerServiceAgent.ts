import { ChatMessage } from './ChatMessage.ts';
import { ChatSession } from './ChatSession.ts';
import { OpenAI } from 'https://deno.land/x/openai@v4.68.1/mod.ts';

export class CustomerServiceAgent {
  private chatSession: ChatSession;
  private openai: OpenAI;

  public constructor(chatSession: ChatSession, openai: OpenAI) {
    this.chatSession = chatSession;
    this.openai = openai;
  }

  public send(message: ChatMessage) {
    console.log('OpenAI Request: ' + message.getMessage());

    this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message.getMessage() },
      ],
    })
      .then((chatCompletion) => {
        const message = chatCompletion.choices[0].message.content;
        console.log('OpenAI Response: ' + message);

        if (typeof message === 'string') {
          this.chatSession.send(ChatMessage.fromCustomerServiceAgent(message));
        }
      });
  }
}
