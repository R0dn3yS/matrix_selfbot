import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function nhentaiHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = text.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('[') && arg.endsWith(']')) {
      const digits = arg.split('[')[1].replaceAll(']', '');

      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://nhentai.net/g/${digits}">${digits}</a>`;
    }
  }

  const newText = newTextArr.join(' ');
  if (newText === text) return text;

  return newText
}