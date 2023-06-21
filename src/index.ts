import { readdirSync, readFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { AutojoinRoomsMixin, ICryptoStorageProvider, LogLevel, LogService, MatrixClient, MessageEvent, RichConsoleLogger, RustSdkCryptoStorageProvider, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import * as path from 'path';
import config from './config';
import { aurHandler } from './handlers/aur';
import { emojiHandler } from './handlers/emoji';
import { mentionHandler } from './handlers/mention';
import { pkgHandler } from './handlers/pkg';
import { redditHandler } from './handlers/reddit';
import { textreplaceHandler } from './handlers/textreplace';
import { editMessage } from './util/util';
import { nhentaiHandler } from './handlers/nhentai';
import { bottomHandler } from './handlers/bottom';

ensureDirSync('assets/httpcat');
ensureDirSync('assets/xkcd');
ensureDirSync('assets/emoji');

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.DEBUG);
LogService.muteModule('Metrics');
LogService.info('index', 'Bot starting...');

const storage = new SimpleFsStorageProvider(path.join(config.dataPath, 'bot.json'));

let cryptoStore: ICryptoStorageProvider;
if (config.encryption) {
  cryptoStore = new RustSdkCryptoStorageProvider(path.join(config.dataPath, 'encrypted'));
}

export class CommandMatrixClient extends MatrixClient {
  commands: Map<string, unknown>;
  emoji: Map<string, string>;
  emojiSize: number;
  prefix: string;
  mimeMap: Map<string, string>;
  kaomoji: Map<string, string>;

  constructor(home: string, access: string, storage: SimpleFsStorageProvider, crypto: ICryptoStorageProvider) {
    super(home, access, storage, crypto);

    this.commands = new Map();
    this.emoji = new Map();
    this.prefix = '\\';
    this.mimeMap = new Map();
    this.emojiSize = 24;
  }
}

const client = new CommandMatrixClient(config.homeserverUrl, config.accessToken, storage, cryptoStore);

client.mimeMap.set('png', 'image/png');
client.mimeMap.set('jpg', 'image/jpeg');
client.mimeMap.set('gif', 'image/gif');

const rawData = readFileSync('textreplace.json').toString();
const kaomojiData = JSON.parse(rawData);
client.kaomoji = new Map(Object.entries(kaomojiData));

['command'].forEach(async handler => {
  (await import (`./handlers/${handler}`)).default(client);
});

readdirSync('assets/emoji').forEach(async emoji => {
  const ext = emoji.split('.')[1];
  const mxc = await client.uploadContent(readFileSync(`assets/emoji/${emoji}`), client.mimeMap.get(ext), emoji);
  client.emoji.set(emoji.split('.')[0], mxc);
});

if (config.autoJoin) {
  AutojoinRoomsMixin.setupOnClient(client);
}

client.on('room.message', async (roomId: string, ev: any) => {
  try {
    const event = new MessageEvent(ev);

    if (event.isRedacted) return;
    if (event.messageType !== 'm.text') return;
    if (event.content['m.new_content']) return;

    let raw = event.raw.content['formatted_body'] ? event.raw.content['formatted_body'] : event.textBody;
    let text = '';

    if (raw.includes('</mx-reply>')) {
      text = raw.split('</mx-reply>')[1];
    } else {
      text = raw;
    }

    let origText = text;

    if (text.includes('(<a href=\"https://github.com/R0dn3yS/matrix_selfbot\">SelfBot</a>)')) return;

    if (event.sender === await client.getUserId() && !text.startsWith('\\')) {
      text = await mentionHandler(roomId, event, client, text)
      if (event.textBody.includes(':')) text = await emojiHandler(roomId, event, client, text);
      if (event.textBody.includes(';')) text = await textreplaceHandler(roomId, event, client, text);
      if (event.textBody.includes('aur')) text = await aurHandler(roomId, event, client, text);
      if (event.textBody.includes('pkg')) text = await pkgHandler(roomId, event, client, text);
      if (event.textBody.includes('r/')) text = await redditHandler(roomId, event, client, text);
      if (event.textBody.includes('[')) text = await nhentaiHandler(roomId, event, client, text);
      if (event.textBody.includes('^')) text = await bottomHandler(roomId, event, client, text);

      if (text !== origText) return editMessage(roomId, client, event, `${text}`);
    }

    if (!event.textBody.startsWith(client.prefix)) return;

    const args = event.textBody.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command: any = client.commands.get(cmd);
    
    if (!command) return
    if (command.admin) {
      if (event.sender === await client.getUserId()) command.run(roomId, event, args, client);
    } else {
      command.run(roomId, event, args, client);
    }
  } catch (e) {
  console.log(e);
  }
});

LogService.info('index', 'Starting sync...');
client.start();