// import { REST, Routes } from "discord.js"
import Env from "./config/env";
import { Client, IntentsBitField as Intents, Embed } from "discord.js";
import registerCommand from "./commands/register";

registerCommand();

const client = new Client({
  intents: [Intents.Flags.Guilds],
});

client.on("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, channelId } = interaction;
  console.log(interaction);
  if (commandName === "authenticate") {
    const tokenInput = interaction.options.get("token");
    const value = tokenInput.value as string;
    interaction.reply(value);
  } else if (commandName === "embed") {
  }
});

client.login(Env.discordToken);
