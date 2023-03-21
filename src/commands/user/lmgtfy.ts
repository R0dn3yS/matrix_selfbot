import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'lmgtfy',
  description: 'Let me google that for you',
  usage: ' [Query]',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const url = 'https://lmgtfy.app/?q=' + args.join('+');
    const newUrl = await fetch(url).then(res => res.url);

    return await sendText(roomId, client, newUrl);
  }
}