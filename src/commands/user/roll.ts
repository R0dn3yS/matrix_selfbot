import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'roll',
  description: 'Roll a dice (with number sides)',
  usage: ' (Number)',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const dice = args[0] === undefined ? 6 : parseInt(args[0]);

    let result = 0;

    if (dice === 6 || args[0] === dice.toString()) result = Math.ceil(Math.random() * dice);

    const text = result.toString();
    return await sendText(roomId, client, text);

  }
}