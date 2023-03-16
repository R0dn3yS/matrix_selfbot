import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { editMessage } from "../util/util";

export async function pkgHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = text.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('{pkg|') && arg.endsWith('}')) {
      const pkg = arg.split('{pkg|')[1].replaceAll('}', '');

      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://archlinux.org/packages/?name=${pkg}">${pkg}</a>`;
    }
  }

  const newText = newTextArr.join(' ');
  if (newText === text) return text;

  return newText;
}