// import { REST, Routes } from "discord.js"
import Env from "./env";
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

  const { commandName, options } = interaction;
  // console.log(interaction);
  if (commandName === "authenticate") {
    interaction.reply(`Hello, bro!`);
  } else if (commandName === "embed") {
  }
});

client.login(Env.discordToken);
