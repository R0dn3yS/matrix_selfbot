import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function textreplaceHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  const args = text.replace('\n\n', ' ').trim().split(/ +/g);

  let newTextArr = text.split(' ');

  for (const arg of args) {
    if (arg.startsWith(';') && arg.endsWith(';')) {
      const kaomojiName = arg.replaceAll(';', '');

      if (!client.kaomoji.has(kaomojiName)) return;

      newTextArr[newTextArr.indexOf(arg)] = client.kaomoji.get(kaomojiName);
    }
  }

  const newText = newTextArr.join(' ');
  if (newText === text) return;

  return newText
}