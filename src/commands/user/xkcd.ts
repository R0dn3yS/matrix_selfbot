import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { getCloseMatches } from 'difflib';
import { delay, downloadImage, filterTitle, sendText } from '../../util/util';
import { readFileSync } from 'fs';

export default {
  name: 'xkcd',
  description: 'Get an XKCD comic',
  usage: ' (Number/Title)',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let comic = '';

    if (args.length === 1 && parseInt(args[0]).toString() === args[0]) {
      comic = args[0] + '/';
    } else if (args.length > 0) {
      const lookup = {};

      const r = await fetch('https://xkcd.com/archive/').then(res => res.text());

      for (const line of r.split('\n')) {
        if (line.includes('<a href="') && line.includes('" title="2')) {
          const num = line.split('/')[1];
          const title = filterTitle(line.split('>')[1].split('<')[0]);
          lookup[title] = num;
        }
      }

      const user_title = (args.join(' '));
      const title = getCloseMatches(user_title, Object.keys(lookup), 1);

      if (title.length > 0) {
        comic = lookup[title[0]] + '/';
      } else {
        return await sendText(roomId, client, 'Could not find XKCD!');
      }
    }

    const r = await fetch(`https://xkcd.com/${comic}info.0.json`).then(res => res.text());

    let rj;

    try {
      rj = JSON.parse(r);
    } catch (e) {
      return await sendText(roomId, client, 'Failed to get XKCD!');
    }

    const filename = await downloadImage(rj['img'], `assets/xkcd/${rj['num'].toString()}.${rj['img'].split('.')[rj['img'].split('.').length - 1]}`);
    await delay(1000);

    const mxc = await client.uploadContent(readFileSync(filename), 'image/jpeg', `${rj['num']}.jpg`);

    await sendText(roomId, client, `${rj['year']}/${rj['month']}/${rj['day']}, ${rj['num']}: <a href="https://xkcd.com/${rj['num']}/">${rj['safe_title']}</a>`);

    return client.sendMessage(roomId, {
      "body": rj['num'].toString(),
      "info": {
        "h": 0,
        "mimetype": "image/png",
        "size": 0,
        "w": 0
      },
      "msgtype": "m.image",
      "url": mxc
    });
  }
}