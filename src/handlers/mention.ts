import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { getMention } from '../util/util';

export async function mentionHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.raw.content['formatted_body']) {
    text = event.raw.content['formatted_body'];
    const splitText = text.split('<a href="https://matrix.to/#/')

    if (text.includes('<a href="https://matrix.to/#/')) {
      for (let i = 1; i < splitText.length; i++) {
        const toReplace = `<a href="https://matrix.to/#/${splitText[i].split('</a>')[0]}</a>`;
        const name = splitText[i].split('>')[1].split('<')[0];
        const mention_html = splitText[i].split('>')[0].slice(0, -1)
        const mention = mention_html.replace('%40', '@').replace('%3A', ':').replace('%23', '#');

        if (mention.startsWith('@')) {
          const profile = await client.getUserProfile(mention);

          if (!profile['avatar_url']) continue;
          const avatar = profile['avatar_url'];
          text = text.replace(toReplace, getMention(mention, name, avatar));
        }
      }
    }
  }

  return text;
}