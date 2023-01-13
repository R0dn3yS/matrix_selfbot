import { MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import * as htmlEsacape from 'html-escape';

export async function runAwCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
  args.shift();
  const url = 'https://wiki.archlinux.org/index.php?search=' + args.join('+');
  const newUrl = await fetch(url).then(res => res.url);

  let text = newUrl;
  let html = `${htmlEsacape(newUrl)}`;

  return client.sendMessage(roomId, {
    body: text,
    msgtype: 'm.text',
    format: 'org.matrix.custom.html',
    formatted_body: html,
  });
}