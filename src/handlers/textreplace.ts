import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { editMessage } from "../util/util";

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

  return await (editMessage(roomId, client, event, newText));
}