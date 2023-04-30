// import { REST, Routes } from "discord.js"
import Env from "./config/env";
import { Client, IntentsBitField as Intents, EmbedBuilder } from "discord.js";
import registerCommand from "./commands/register";
import BotServices from "./botServices";

registerCommand();

const botServices = new BotServices();

const client = new Client({
  intents: [Intents.Flags.Guilds],
});

client.on("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, channelId } = interaction;
  const embed = new EmbedBuilder();

  // handle bot authentication.
  if (commandName === "authenticate") {
    const tokenInput = interaction.options.get("token");
    const tokenValue = tokenInput.value as string;

    // make authentication requests.
    const response = await botServices.authenticateBot(tokenValue, channelId);
    const embeddColor = response?.success ? 0x3f7eee : 0xff0000;
    const embeddTitle = response?.success
      ? `✅ **Successful Authenticaton**`
      : `❌ **Failed Authentication**`;
    const embeddMsg = embed
      .setTitle(embeddTitle)
      .setDescription(response?.message)
      .setColor(embeddColor);

    // handle response.
    // * ephemeral: true would only make the message visible to sender.
    if (response?.success === false)
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
    if (response?.success === true)
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
  }
  if (commandName === "threads") {
    try {
      const response = await botServices.handleThreads(channelId);
      const embeddColor = response?.success ? 0x3f7eee : 0xff0000;
      const embeddTitle = response?.success
        ? `✅ **Latest Thread**`
        : `❌ **Failed Fetching Thread**`;

      let embeddMsg = embed
        .setTitle(embeddTitle)
        .setDescription(response?.content ?? response?.msg)
        .setColor(embeddColor)
        .setURL(response?.url)
        .setImage(
          response?.image ??
            "https://images-ext-1.discordapp.net/external/qzgQmLYic48-UPuxj52aRYm9vXgpjvUoXqNXPUvwWxE/https/assets.showwcase.com/og-image/default.png?width=1382&height=972"
        );

      // * ephemeral: true would only make the message visible to sender.
      if (response?.success === false)
        interaction.reply({ embeds: [embeddMsg], ephemeral: true });
      if (response?.success === true)
        interaction.reply({
          embeds: [embeddMsg],
          ephemeral: false,
        });
    } catch (e: any) {
      // console.log(e);
      const embeddMsg = embed
        .setTitle(`❌ **Failed Fetching Thread**`)
        .setDescription(`Something went wrong. Please try again later.`);
      interaction.reply({ embeds: [embeddMsg], ephemeral: true });
    }
  }
});

client.login(Env.discordToken);
