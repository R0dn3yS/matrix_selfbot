import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function aurHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = text.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('{aur|') && arg.endsWith('}')) {
      const pkg = arg.split('{aur|')[1].replaceAll('}', '');

      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://aur.archlinux.org/packages?K=${pkg}">${pkg}</a>`;
    }
  }

  const newText = newTextArr.join(' ');
  if (newText === text) return text;

  return newText
}