import { existsSync, readFileSync } from 'fs';
import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { delay, downloadImage } from '../../util/util';

export default {
  name: 'httpcat',
  description: 'Get a HTTP cat',
  usage: ' [Status Code]',
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    if (args[0] === undefined) return;

    const code = args[0];

    if (!existsSync(`httpcat/${code}.jpg`)) {
      downloadImage(`https://http.cat/${code}`, `httpcat/${code}.jpg`);
      await delay(1000);
    }

    const mxc = await client.uploadContent(readFileSync(`httpcat/${code}.jpg`), 'image/jpeg', `${code}.jpg`);

    return client.sendMessage(roomId, {
      "body": code,
      "info": {
        "h": 0,
        "mimetype": "",
        "size": 0,
        "w": 0
      },
      "msgtype": "m.image",
      "url": mxc
    });
  }
}