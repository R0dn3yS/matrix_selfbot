import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "..";

export async function emojiHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  const args = text.replace('\n\n', ' ').trim().split(/ +/g);

  let newTextArr = text.split(' ');

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

  if (newText === text) return;

  return newText;
}