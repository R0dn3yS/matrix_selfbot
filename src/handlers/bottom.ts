import { MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { CommandMatrixClient } from '..';
import { editMessage } from '../util/util';

const CHARACTER_VALUES: [number, string][] = [
  [200, '🫂'],
  [50, '💖'],
  [10, '✨'],
  [5, '🥺'],
  [1, ','],
  [0, '❤️'],
];
const SECTION_SEPERATOR = '👉👈';

export async function bottomHandler(roomId: string, event: MessageEvent<MessageEventContent>, client: CommandMatrixClient, text: string) {
  if (event.sender !== await client.getUserId()) return;

  const newTextArr = text.split('%b');

  newTextArr[1] = encode(newTextArr[1]);

  const newText = newTextArr.join(' ');
  if (newText === text) return text;

  return newText;
}

interface TextEncoderType {
  encode: (input?: string) => Uint8Array;
}

function encodeChar(charValue: number): string {
  if (charValue === 0) return '';
  let [val, currentCase]: [number, string] =
    CHARACTER_VALUES.find(([val]) => charValue >= val) || CHARACTER_VALUES[-1];
  return `${currentCase}${encodeChar(charValue - val)}`;
}

function textEncoder(): TextEncoderType {
  try {
    return new TextEncoder();
  } catch {
    return new (require('util').TextEncoder)();
  }
}

function encode(value: string): string {
  return Array.from(textEncoder().encode(value))
    .map((v: number) => encodeChar(v) + SECTION_SEPERATOR)
    .join('');
}