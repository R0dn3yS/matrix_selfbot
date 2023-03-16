import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function redditHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  let newTextArr = text.split(' ');

  for (const arg of newTextArr) {
    if (arg.startsWith('r/')) {
      newTextArr[newTextArr.indexOf(arg)] = `<a href="https://reddit.com/${arg}">${arg}</a>`;
    }
  }

  const newText = newTextArr.join(' ');
  if (newText === text) return text;

  
  return newText
}