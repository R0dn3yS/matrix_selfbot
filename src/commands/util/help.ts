import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'help',
  description: 'Return help menu',
  usage: '',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let helpMessage = '<br /><pre><code>Commands:<br /><br />';

    for (const command of client.commands as unknown as [string, any][]) {
      helpMessage += `${client.prefix}${command[1].name}${command[1].usage}: ${command[1].description}<br />`;
    }

    helpMessage += '<br />Arguments: (optional) [required]</code></pre>';

    let text = helpMessage;

    return await sendText(roomId, client, text);
  }
}