import { readdirSync } from 'fs';
import { CommandMatrixClient } from '..';

export default function (client: CommandMatrixClient) {
  readdirSync('src/commands/').forEach(async dir => {
    const commands = readdirSync(`src/commands/${dir}/`);

    for (const file of commands) {
      const pull = await import (`../commands/${dir}/${file}`);

      if (pull.default.name) {
        client.commands.set(pull.default.name, pull.default);
      }
    }
  });
}