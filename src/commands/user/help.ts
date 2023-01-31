import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'help',
  description: 'Return help menu',
  usage: '',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let admin = 'Admin Commands:<br />';
    let user = 'User Commands:<br />';

    for (const command of client.commands as unknown as [string, any][]) {
      if (command[1].category === 'admin') {
        admin += `${client.prefix}${command[1].name}${command[1].usage}: ${command[1].description}<br />`;
      } else if (command[1].category === 'user') {
        user += `${client.prefix}${command[1].name}${command[1].usage}: ${command[1].description}<br />`;
      }
    }

    const helpMessage = `${admin}<br />${user}<br /><br />Arguments: (optional) [required] {admin only, optional}</code></pre>`;

    return await sendText(roomId, client, helpMessage);
  }
}