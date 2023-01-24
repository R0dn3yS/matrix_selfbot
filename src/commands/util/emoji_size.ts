import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';

export default {
  name: 'emoji_size',
  description: 'Set the default emoji size',
  usage: ' [size]',
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let emojiSize = args[0] === '' ? client.emojiSize : parseInt(args[0]);
    if (emojiSize === undefined) emojiSize = client.emojiSize;
  }
}