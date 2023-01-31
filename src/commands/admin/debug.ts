import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { sendText } from '../../util/util';

export default {
  name: 'debug',
  description: 'Return help menu',
  usage: '',
  category: 'admin',
  admin: true,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = 'epic fail';

    try {
      text = `Value of <code>${args.join(' ')}</code> is set to: <code>${eval(args.join(' '))}</code>`;
    } catch (e) {
      console.log(e);
    }

    return await sendText(roomId, client, text);
  }
}