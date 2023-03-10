import { readFileSync } from 'fs';
import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { delay, downloadImage } from '../../util/util';

export default {
  name: 'httpcat',
  description: 'Get a HTTP cat',
  usage: ' [Status Code]',
  category: 'user',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const codes = [100, 101, 102, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 498, 499, 500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511, 521, 522, 523, 525, 599];
    const randomCode = codes[Math.ceil(Math.random() * codes.length)];

    const code = args[0] === undefined ? randomCode.toString() : args[0];

    const filepath = await downloadImage(`https://http.cat/${code}`, `assets/httpcat/${code}.jpg`);
    await delay(1000);

    const mxc = await client.uploadContent(readFileSync(filepath), 'image/jpeg', `${code}.jpg`);

    return client.sendMessage(roomId, {
      "body": code,
      "info": {
        "h": 0,
        "mimetype": "image/jpeg",
        "size": 0,
        "w": 0
      },
      "msgtype": "m.image",
      "url": mxc
    });
  }
}