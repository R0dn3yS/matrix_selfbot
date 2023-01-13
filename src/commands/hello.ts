import { MatrixClient, MentionPill, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import * as htmlEsacape from 'html-escape';

export async function runHelloCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
  let sayHelloTo = args[1];
  if (!sayHelloTo) sayHelloTo = event.sender;

  let text = `Hello ${sayHelloTo}`;
  let html = `Hello ${htmlEsacape(sayHelloTo)}!`;

  if (sayHelloTo.startsWith('@')) {
    const mention = await MentionPill.forUser(sayHelloTo, roomId, client);
    text = `Hello ${mention.text}`;
    html = `Hello ${mention.html}`;
  }

  return client.sendMessage(roomId, {
    body: text,
    msgtype: 'm.text',
    format: 'org.matrix.custom.html',
    formatted_body: html,
  });
}