import { MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { CommandMatrixClient } from "../..";

export default {
  name: 'shrug',
  description: 'Append ¯\\_(ツ)_/¯ to the text',
  usage: ' [text]',
  admin: true,
  run: (roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: CommandMatrixClient) => {
    let text = args.join(' ');
    text += ' ¯\\_(ツ)_/¯';

    return client.sendMessage(roomId, {
      body: `* ${text}`,
      msgtype: 'm.text',
      'm.relates_to': {
        rel_type: 'm.replace',
        event_id: event.eventId,
      },
      format: 'org.matrix.custom.html',
      formatted_body: `* ${text}`,
      'm.new_content': {
        'msgtype': 'm.text',
        'body': text,
        'format': 'org.matrix.custom.html',
        'formatted_body': text
      }
    });
  }
}