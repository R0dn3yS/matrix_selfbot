import { AutojoinRoomsMixin, ICryptoStorageProvider, LogLevel, LogService, MatrixClient, RichConsoleLogger, RustSdkCryptoStorageProvider, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import * as path from 'path';
import config from './config';

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.DEBUG);
LogService.muteModule('Metrics');
LogService.info('index', 'Bot starting...');

const storage = new SimpleFsStorageProvider(path.join(config.dataPath, 'bot.json'));

let cryptoStore: ICryptoStorageProvider;
if (config.encryption) {
  cryptoStore = new RustSdkCryptoStorageProvider(path.join(config.dataPath, 'encrypted'));
}

const client = new MatrixClient(config.homeserverUrl, config.accessToken, storage, cryptoStore);

if (config.autoJoin) {
  AutojoinRoomsMixin.setupOnClient(client);
}

LogService.info('index', 'Starting sync...');
client.start();