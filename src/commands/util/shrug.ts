import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "../..";
import { editMessage } from "../../util/util";

export default {
  name: 'shrug',
  description: 'Append ¯\\_(ツ)_/¯ to the text',
  usage: ' [text]',
  admin: true,
  run: async (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = args.join(' ');
    text += ' ¯\\_(ツ)_/¯';

    return await editMessage(roomId, client, event, text);
  }
}