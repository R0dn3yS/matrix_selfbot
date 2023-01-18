import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';

export default {
  name: 'roll',
  description: 'Roll a dice (with number sides)',
  usage: ' (Number)',
  run: (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const dice = args[0] === undefined ? 6 : parseInt(args[0]);

    let result = 0;

    if (dice === 6 || args[0] === dice.toString()) result = Math.ceil(Math.random() * dice);

    return client.sendMessage(roomId, {
      body: result.toString(),
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: result.toString(),
    });
  }
}