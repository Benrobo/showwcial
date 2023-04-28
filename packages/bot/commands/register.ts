import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
import Env from "../env";

const commands = [
  {
    name: "authenticate",
    description: "Authenticate showwcial BOT.",
    options: [
      {
        name: "token",
        description: "Showwcial notifier token.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "9" }).setToken(Env.discordToken as string);

export default async function registerCommands() {
  try {
    console.log("REGISTERING....");
    await rest.put(
      Routes.applicationGuildCommands(Env.discordClientId as string, Env.botId),
      {
        body: commands,
      }
    );
    console.log("SLASH COMMAND REGISTERING....");
  } catch (e: any) {
    console.log(e);
    console.log(`Error registering commands: ${e.message}`);
  }
}
