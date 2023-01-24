import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { getCloseMatches } from 'difflib';

export default {
  name: 'xkcd',
  description: 'Get an XKCD comic',
  usage: ' (Number/Title)',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let comic = '';

    if (args.length === 1 && parseInt(args[0]).toString() === args[0]) {
      comic = args[0] + '/';
    } else if (args.length > 0) {
      const lookup = {};

      const r = await fetch('https://xkcd.com/archive/').then(res => res.text());

      for (const line of r.split('\n')) {
        if (line.includes('<a href="') && line.includes('" title="2"')) {
          const num = line.split('/')[1];
          const title = line.split('>')[1].split('<')[0];
          lookup[title] = num;
        }
      }

      const user_title = (args.join(' '));
      const title = getCloseMatches(user_title, Object.keys(lookup), 1);

      if (title.length > 0) {
        comic = lookup[title[0]] + '/';
      } else {
        return 
      }
    }
  }
}