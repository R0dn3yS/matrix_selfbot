import { LogService, MatrixClient, MessageEvent, RichReply, UserID } from 'matrix-bot-sdk';
import { runHelloCommand } from './hello';
import { runAwCommand } from './aw';
import * as htmlEscape from 'escape-html';

export const COMMAND_PREFIX = '\\';

export default class CommandHandler {
  private displayName: string;
  private userId: string;
  private localpart: string;

  constructor(private client: MatrixClient) {

  }

  public async start() {
    await this.prepareProfile();

    this.client.on('room.message', this.onMessage.bind(this));
  }

  private async prepareProfile() {
    this.userId = await this.client.getUserId();
    this.localpart = new UserID(this.userId).localpart;

    try {
      const profile = await this.client.getUserProfile(this.userId);
      if (profile && profile['displayname']) this.displayName = profile['displayname'];
    } catch (e) {
      LogService.warn('CommandHandler');
    }
  }

  private async onMessage(roomId: string, ev: any) {
    const event = new MessageEvent(ev);
    if (event.isRedacted) return;
    if (event.sender !== this.userId) return;
    if (event.messageType !== 'm.text') return;
    
    if (!event.textBody.startsWith(COMMAND_PREFIX)) return;

    const args = event.textBody.substring(COMMAND_PREFIX.length).trim().split(' ');

    try {
      if (args[0] === 'hello') {
        return runHelloCommand(roomId, event, args, this.client);
      } else if (args[0] === 'aw') {
        return runAwCommand(roomId, event, args, this.client);
      } else {
        const help = '' +
          '\\hello      - Pings the bot.\n' +
          '\\help       - This menu\n';

        const text = `Help menu:\n${help}`;
        const html = `<b>Help menu:</b><br /><pre><code>${htmlEscape(help)}</code></pre>`;
        const reply = RichReply.createFor(roomId, ev, text, html);
        reply['msgtype'] = 'm.notice';
        return this.client.sendMessage(roomId, reply);
      }
    } catch (e) {
      LogService.error('CommandHandler', e);

      const message = 'There was an error processing the command';
      return this.client.replyNotice(roomId, ev, message);  
    }
  }
}