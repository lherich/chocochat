const uuid = self.crypto.randomUUID();
const wsUri = 'wss://localhost:4431/websocket/' + uuid;

const ChatEvent = {
  FromCustomer: 'from-customer',
  FromCustomerServiceAgent: 'from-customer-service-agent',
  Broadcast: 'broadcast',
};

const socket = new WebSocket(wsUri);
console.debug(socket);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.debug(data);
  switch (data.event) {
    case ChatEvent.FromCustomer:
      addMessage('send', data.content, data.datetime);
      break;

    case ChatEvent.FromCustomerServiceAgent:
      addMessage('received', data.content, data.datetime);
      break;

    case ChatEvent.Broadcast:
      addMessage('received', data.content, data.datetime);
      break;
  }
};

function addMessage(event, message, datetime) {
  const template = document.getElementById('message');
  const clone = template.content.cloneNode(true);
  const conversation = document.getElementById('conversation');

  clone.querySelector('.message').setAttribute('class', event);
  clone.querySelector('.chat_header').textContent = datetime;
  clone.querySelector('.chat_content').textContent = message;

  document.getElementById('conversation').append(clone);
  conversation.scrollTop = conversation.scrollHeight;
}

const inputElement = document.getElementById('data');
inputElement.focus();

const form = document.getElementById('form');

form.onsubmit = (e) => {
  e.preventDefault();
  const message = inputElement.value;
  inputElement.value = '';
  socket.send(
    JSON.stringify({ event: ChatEvent.FromCustomer, message: message }),
  );
};
