import { readdirSync, readFileSync } from 'fs';
import { AutojoinRoomsMixin, ICryptoStorageProvider, LogLevel, LogService, MatrixClient, MessageEvent, RichConsoleLogger, RustSdkCryptoStorageProvider, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import * as path from 'path';
import config from './config';
import { emojiHandler } from './handlers/emoji';
import { textreplaceHandler } from './handlers/textreplace';

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
  prefix: string;
  mimeMap: Map<string, string>;
  kaomoji: Map<string, string>;

  constructor(home: string, access: string, storage: SimpleFsStorageProvider, crypto: ICryptoStorageProvider) {
    super(home, access, storage, crypto);

    this.commands = new Map();
    this.emoji = new Map();
    this.prefix = '\\';
    this.mimeMap = new Map();
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
  const event = new MessageEvent(ev);

  if (event.isRedacted) return;
  if (event.messageType !== 'm.text') return;
  if (event.content['m.new_content']) return;

  if (event.textBody.includes(':')) emojiHandler(roomId, event, client);
  if (event.textBody.includes(';')) return textreplaceHandler(roomId, event, client);
  if (!event.textBody.startsWith(client.prefix)) return;

  const args = event.textBody.slice(client.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command: any = client.commands.get(cmd);
  
  if (command) command.run(roomId, event, args, client);
});

LogService.info('index', 'Starting sync...');
client.start();