import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { editMessage } from "../util/util";

export async function redditHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = event.textBody.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('r/')) {
      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://reddit.com/${arg}">${arg}</a>`;
    }
  }

  console.log('hello');

  const newText = newTextArr.join(' ');
  if (newText === event.textBody) return;

  console.log('hello');
  await editMessage(roomId, client, event, newText);
}