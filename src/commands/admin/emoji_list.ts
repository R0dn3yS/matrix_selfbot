import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'emoji_list',
  description: 'Get a list of usable emojis',
  usage: '',
  category: 'admin',
  admin: true,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = `Default emoji size: ${client.emojiSize}<br />Available emojis:<br />`;

    for (const emoji of client.emoji) {
      text += `${emoji[0]}: <img height="24" src="${emoji[1]}" alt="${emoji[0]}">, `;
    }

    return await sendText(roomId, client, text);
  }
}