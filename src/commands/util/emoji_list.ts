import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';

export default {
  name: 'emoji_list',
  description: 'Get a list of usable emojis',
  usage: '',
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = `Default emoji size: ${client.emojiSize}<br />Available emojis:<br />`;

    for (const emoji of client.emoji) {
      text += `${emoji[0]}: <img height="24" src="${emoji[1]}" alt="${emoji[0]}">, `;
    }

    return client.sendMessage(roomId, {
      body: text,
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: text,
    });
  }
}