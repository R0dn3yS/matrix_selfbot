import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';

export default {
  name: 'aw',
  description: 'Search Archwiki',
  usage: ' [Search term]',
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const url = 'https://wiki.archlinux.org/index.php?search=' + args.join('+');
    const newUrl = await fetch(url).then(res => res.url);

    let text = newUrl;

    return client.sendMessage(roomId, {
      body: text,
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: text,
    });
  }
}