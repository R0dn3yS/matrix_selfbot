import { createWriteStream, existsSync } from "fs";
import { get } from "https";
import { CommandMatrixClient } from "..";
import * as htmlEscape from 'escape-html';

export async function sendText(roomId: string, client: CommandMatrixClient, text: string) {
  let unformatted = text;
  let formatted = text;

  const tmp = [];
  for (const part of unformatted.split('<')) {
    tmp.push(part.split('>')[part.split('>').length - 1]);
  }
  unformatted = tmp.join('');
  unformatted = htmlEscape(unformatted);

  formatted = formatted.replace('\n', '<br>');

  return await client.sendMessage(roomId, {
    body: unformatted + ' (SelfBot)',
    msgtype: 'm.text',
    format: 'org.matrix.custom.html',
    formatted_body: formatted + ' (<a href="https://github.com/R0dn3yS/matrix_selfbot">SelfBot</a>)',
  });
}

export async function getRoomDisplayName(roomId: string, client: CommandMatrixClient): Promise<string> {
  let roomName: string;

  try {
    roomName = (await client.getRoomStateEvent(roomId, 'm.room.name', '')).name;
  } catch (e) {
    console.log(e);
  }

  if (roomName === '' || roomName === undefined) {
    try {
      roomName = (await client.getRoomStateEvent(roomId, 'm.room.canonical_alias', '')).name;
    } catch (e) {
      console.log(e);
    }
  }

  if (roomName === '' || roomName === undefined) {
    try {
      const roomMembers = await client.getAllRoomMembers(roomId);

      roomName = roomMembers[0].content.displayname !== 'rodney' ? roomMembers[0].content.displayname : roomMembers[1].content.displayname;
    } catch (e) {
      console.log(e);
    }
  }

  return roomName;
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function downloadImage(url: string, filepath: string) {
  if (existsSync(filepath)) {
    return filepath;
  }

  get(url, (res) => {
    res.pipe(createWriteStream(filepath));
  });
  return filepath;
}

export function filterTitle(title: string) {
  let filteredTitle = '';

  for (const char of title.toLowerCase()) {
    if (char !== ' ') {
      filteredTitle += char;
    }
  }

  return filteredTitle;
}