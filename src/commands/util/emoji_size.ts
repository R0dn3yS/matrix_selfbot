import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';

export default {
  name: 'emoji_size',
  description: 'Set the default emoji size',
  usage: ' [size]',
  admin: true,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = '';
    
    if (args[0] === undefined) {
      text = `Emoji size is: ${client.emojiSize}`;
    } else {
      let emojiSize = args[0] === '' ? client.emojiSize : parseInt(args[0]);
      if (emojiSize === undefined) emojiSize = client.emojiSize;
  
      client.emojiSize = emojiSize;

      text = `Emoji size set to: ${emojiSize}`;
    }

    return client.sendMessage(roomId, {
      body: text,
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: text,
    });
  }
}