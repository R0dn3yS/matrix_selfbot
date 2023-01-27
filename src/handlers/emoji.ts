import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";
import { editMessage } from "../util/util";

export async function emojiHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient) {
  if (event.sender !== await client.getUserId()) return;

  const args = event.textBody.replace('\n\n', ' ').trim().split(/ +/g);

  let newTextArr = event.textBody.split(' ');

  for (const arg of args) {
    if (arg.startsWith(':') && arg.endsWith(':')) {
      const emojiData = arg.split(':');
      
      const emojiName = emojiData[1];
      let emojiSize = emojiData[2] === '' ? client.emojiSize : parseInt(emojiData[2]);
      if (emojiSize === undefined) emojiSize = client.emojiSize;

      const emoji = client.emoji.get(`${emojiName}`);
      console.log(emoji);

      if (!emoji) return;

      newTextArr[newTextArr.indexOf(arg)] = `<img height="${emojiSize}" src="${emoji}" alt="${emojiName}">`;
    }
  }

  const newText = newTextArr.join(' ');

  if (newText === event.textBody) return;

  return await (editMessage(roomId, client, event, newText));
}