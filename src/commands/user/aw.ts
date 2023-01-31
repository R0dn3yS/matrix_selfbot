import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'aw',
  description: 'Search Archwiki',
  usage: ' [Search term]',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const url = 'https://wiki.archlinux.org/index.php?search=' + args.join('+');
    const newUrl = await fetch(url).then(res => res.url);

    return await sendText(roomId, client, newUrl);
  }
}