import { readFileSync } from "fs";
import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function emojiHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  const args = event.textBody.replace('\n\n', ' ').trim().split(/ +/g);

  let newText = event.textBody;

  for (const arg of args) {
    if (arg.startsWith(':') && arg.endsWith(':')) {
      const emojiData = arg.split(':');
      
      const emojiName = emojiData[1];
      let emojiSize = emojiData[2] === '' ? 32 : parseInt(emojiData[2]);
      if (emojiSize === undefined) emojiSize = 32;

      if (!client.emoji.includes(`${emojiName}.png`)) continue;

      const mxcUrl = await client.uploadContent(readFileSync(`assets/emoji/${emojiName}.png`), 'image/png', `${emojiName}.png`);

      newText = newText.replace(`:${emojiName}:${emojiSize}:`, `<img height="${emojiSize}" src="${mxcUrl}" alt="${emojiName}">`);
      newText = newText.replace(`:${emojiName}:`, `<img height="${emojiSize}" src="${mxcUrl}" alt="${emojiName}">`);
    }
  }

  console.log(newText);
  if (newText === event.textBody) return;

  return client.sendMessage(roomId, {
    body: `* ${newText}`,
    msgtype: 'm.text',
    'm.relates_to': {
      rel_type: 'm.replace',
      event_id: event.eventId,
    },
    format: 'org.matrix.custom.html',
    formatted_body: `* ${newText}`,
    'm.new_content': {
      'msgtype': 'm.text',
      'body': newText,
      'format': 'org.matrix.custom.html',
      'formatted_body': newText
    }
  });
}