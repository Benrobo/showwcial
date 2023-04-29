import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
import Env from "../config/env";

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
  {
    name: "threads",
    description:
      "Because who doesn't want to keep up with the latest thread drama?",
  },
  {
    name: "shows",
    description:
      "Get your front-row seat to the latest Showwcase shows, guaranteed to make you say 'meh'.",
  },
  {
    name: "jobs",
    description:
      "Get the latest job openings from Showwcase, we all know you're not happy with your current one.",
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
