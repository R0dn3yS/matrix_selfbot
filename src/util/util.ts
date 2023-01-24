import { createWriteStream } from "fs";
import { get } from "https";
import { CommandMatrixClient } from "..";

export async function sendText(roomId: string, client: CommandMatrixClient, text: string) {
  let unformatted = text;
  let formatted = text;

  const tmp = [];
  for (const part of unformatted.split('<')) {
    tmp.push(part.split('>')[part.length - 1]);
  }
  unformatted = tmp.join(' ');

  formatted = formatted.replace('\n', '<br>');

  return await client.sendMessage(roomId, {
    body: unformatted,
    msgtype: 'm.text',
    format: 'org.matrix.custom.html',
    formatted_body: formatted,
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

export function downloadImage(url: string, filepath: string) {
  get(url, (res) => {
    res.pipe(createWriteStream(filepath));
  });
}
