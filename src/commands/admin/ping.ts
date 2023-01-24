import { spawn } from 'child_process';
import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '../..';
import { delay, getRoomDisplayName } from '../../util/util';

export default {
  name: 'ping',
  description: 'Ping the selfbot (or any host)',
  usage: ' {host}',
  admin: false,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    const roomDisplayName = await getRoomDisplayName(roomId, client);

    let text = '';

    if (event.sender !== await client.getUserId() || args[0] === undefined) {
      text = `Selfbot is online and accepting messages in ${roomDisplayName}.`;
    } else {
      const flags = ['-c', '1', '-W', '2', args[0]];

      const ping = spawn('ping', flags);
      await delay(2500);

      const exitCode = ping.exitCode;
      const success = exitCode === 0 ? 'successful' : 'unsuccessful';
      console.log(exitCode);
      
      text = `Ping to ${args[0]} was ${success}.`;
    }

    return client.sendMessage(roomId, {
      body: text,
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: text,
    });
  }
}