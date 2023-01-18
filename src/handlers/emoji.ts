import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function emojiHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  if (event.sender !== await client.getUserId()) return;

  const args = event.textBody.replace('\n\n', ' ').trim().split(/ +/g);

  let newTextArr = event.textBody.split(' ');

  for (const arg of args) {
    if (arg.startsWith(':') && arg.endsWith(':')) {
      const emojiData = arg.split(':');
      
      const emojiName = emojiData[1];
      let emojiSize = emojiData[2] === '' ? 32 : parseInt(emojiData[2]);
      if (emojiSize === undefined) emojiSize = 32;

      const emoji = client.emoji.get(`${emojiName}`);
      console.log(emoji);

      if (!emoji) return;

      newTextArr[newTextArr.indexOf(arg)] = `<img height="${emojiSize}" src="${emoji}" alt="${emojiName}">`;
    }
  }

  const newText = newTextArr.join(' ');

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