import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function textreplaceHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  if (event.sender !== await client.getUserId()) return;

  const args = event.textBody.replace('\n\n', ' ').trim().split(/ +/g);

  let newTextArr = event.textBody.split(' ');

  for (const arg of args) {
    if (arg.startsWith(';') && arg.endsWith(';')) {
      const kaomojiName = arg.replaceAll(';', '');

      if (!client.kaomoji.has(kaomojiName)) return;

      newTextArr[newTextArr.indexOf(arg)] = client.kaomoji.get(kaomojiName);
    }
  }

  const newText = newTextArr.join(' ');
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