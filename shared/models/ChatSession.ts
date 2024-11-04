import { Customer } from './Customer.ts';
import { CustomerServiceAgent } from './CustomerServiceAgent.ts';
import { ChatMessage } from './ChatMessage.ts';

export class ChatSession {
  private customer: Customer;
  private customerServiceAgents: CustomerServiceAgent[] = [];

  constructor(customer: Customer) {
    this.customer = customer;
  }

  public addCustomerServiceAgent(
    customerServiceAgent: CustomerServiceAgent,
  ): this {
    this.customerServiceAgents.push(customerServiceAgent);

    return this;
  }

  public send(message: ChatMessage): this {
    this.customer.send(message);

    if (message.isFromCustomer()) {
      this.customerServiceAgents.forEach(
        (customerServiceAgent: CustomerServiceAgent) => {
          customerServiceAgent.send(message);
        },
      );
    }

    return this;
  }
}
