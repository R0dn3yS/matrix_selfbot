import { readdirSync } from 'fs';
import { AutojoinRoomsMixin, ICryptoStorageProvider, LogLevel, LogService, MatrixClient, MessageEvent, RichConsoleLogger, RustSdkCryptoStorageProvider, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import * as path from 'path';
import config from './config';

const prefix = '\\';

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
  categories: string[];

  constructor(home: string, access: string, storage: SimpleFsStorageProvider, crypto: ICryptoStorageProvider) {
    super(home, access, storage, crypto);

    this.commands = new Map();
    this.categories = readdirSync('src/commands');
  }
}

const client = new CommandMatrixClient(config.homeserverUrl, config.accessToken, storage, cryptoStore);


['command'].forEach(async handler => {
  (await import (`./handlers/${handler}`)).default(client);
});

if (config.autoJoin) {
  AutojoinRoomsMixin.setupOnClient(client);
}

client.on('room.message', async (roomId: string, ev: any) => {
  const event = new MessageEvent(ev);

  if (event.isRedacted) return;
  if (event.sender !== await client.getUserId()) return;
  if (event.messageType !== 'm.text') return;

  if (!event.textBody.startsWith(prefix)) return;

  const args = event.textBody.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  console.log(`Commands: ${cmd}`);

  if (cmd.length === 0) return;

  let command: any = client.commands.get(cmd);

  console.log(`Commands: ${command}`);
  
  if (command) command.run(roomId, event, args, client);
});

LogService.info('index', 'Starting sync...');
client.start();