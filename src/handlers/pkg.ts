import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { editMessage } from "../util/util";

export async function pkgHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = event.textBody.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('{pkg|') && arg.endsWith('}')) {
      const pkg = arg.split('{pkg|')[1].replaceAll('}', '');

      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://archlinux.org/packages/?name=${pkg}">${pkg}</a>`;
    }
  }

  console.log('hello');

  const newText = newTextArr.join(' ');
  if (newText === event.textBody) return;

  console.log('hello');
  await editMessage(roomId, client, event, newText);
}