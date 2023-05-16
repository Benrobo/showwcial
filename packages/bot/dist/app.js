"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import { REST, Routes } from "discord.js"
const env_1 = tslib_1.__importDefault(require("./config/env"));
const discord_js_1 = require("discord.js");
const register_1 = tslib_1.__importDefault(require("./commands/register"));
const botServices_1 = tslib_1.__importDefault(require("./botServices"));
(0, register_1.default)();
const botServices = new botServices_1.default();
const client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.Guilds],
});
client.on("ready", async () => {
    console.log(`✅ ${client.user.tag} is online.`);
});
client.on("interactionCreate", async (interaction) => {
    var _a, _b, _c, _d;
    if (!interaction.isCommand())
        return;
    const { commandName, options, channelId } = interaction;
    const embed = new discord_js_1.EmbedBuilder();
    // handle bot authentication.
    if (commandName === "authenticate") {
        const tokenInput = interaction.options.get("token");
        const tokenValue = tokenInput.value;
        // make authentication requests.
        const response = await botServices.authenticateBot(tokenValue, channelId);
        const embeddColor = (response === null || response === void 0 ? void 0 : response.success) ? 0x3f7eee : 0xff0000;
        const embeddTitle = (response === null || response === void 0 ? void 0 : response.success)
            ? `✅ **Successful Authenticaton**`
            : `❌ **Failed Authentication**`;
        const embeddMsg = embed
            .setTitle(embeddTitle)
            .setDescription(response === null || response === void 0 ? void 0 : response.message)
            .setColor(embeddColor);
        // handle response.
        // * ephemeral: true would only make the message visible to sender.
        if ((response === null || response === void 0 ? void 0 : response.success) === false)
            interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        if ((response === null || response === void 0 ? void 0 : response.success) === true)
            interaction.reply({ embeds: [embeddMsg], ephemeral: true });
    }
    if (commandName === "threads") {
        try {
            const response = await botServices.handleThreads(channelId);
            const embeddColor = (response === null || response === void 0 ? void 0 : response.success) ? 0x3f7eee : 0xff0000;
            const embeddTitle = (response === null || response === void 0 ? void 0 : response.success)
                ? `✅ **Latest Thread**`
                : `❌ **Failed Fetching Thread**`;
            const embeddImage = (response === null || response === void 0 ? void 0 : response.success)
                ? (_a = response === null || response === void 0 ? void 0 : response.image) !== null && _a !== void 0 ? _a : "https://images-ext-1.discordapp.net/external/qzgQmLYic48-UPuxj52aRYm9vXgpjvUoXqNXPUvwWxE/https/assets.showwcase.com/og-image/default.png?width=1382&height=972"
                : "https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1933.jpg?w=1000";
            let embeddMsg = embed
                .setTitle(embeddTitle)
                .setDescription((_b = response === null || response === void 0 ? void 0 : response.content) !== null && _b !== void 0 ? _b : response === null || response === void 0 ? void 0 : response.msg)
                .setColor(embeddColor)
                .setURL(response === null || response === void 0 ? void 0 : response.url)
                .setImage(embeddImage);
            // * ephemeral: true would only make the message visible to sender.
            if ((response === null || response === void 0 ? void 0 : response.success) === false)
                interaction.reply({ embeds: [embeddMsg], ephemeral: true });
            if ((response === null || response === void 0 ? void 0 : response.success) === true)
                interaction.reply({
                    embeds: [embeddMsg],
                    ephemeral: false,
                });
        }
        catch (e) {
            // console.log(e);
            const embeddMsg = embed
                .setTitle(`❌ **Failed Fetching Thread**`)
                .setDescription(`Something went wrong. Please try again later.`);
            interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        }
    }
    if (commandName === "shows") {
        try {
            const response = await botServices.handleShows(channelId);
            const embeddColor = (response === null || response === void 0 ? void 0 : response.success) ? 0x3f7eee : 0xff0000;
            const embeddTitle = (response === null || response === void 0 ? void 0 : response.success)
                ? `✅ **Latest Shows**`
                : `❌ **Failed Fetching Shows**`;
            const embeddImage = (response === null || response === void 0 ? void 0 : response.success)
                ? (_c = response === null || response === void 0 ? void 0 : response.image) !== null && _c !== void 0 ? _c : "https://images-ext-1.discordapp.net/external/qzgQmLYic48-UPuxj52aRYm9vXgpjvUoXqNXPUvwWxE/https/assets.showwcase.com/og-image/default.png?width=1382&height=972"
                : "https://img.freepik.com/free-vector/400-error-bad-request-concept-illustration_114360-1933.jpg?w=1000";
            let embeddMsg = embed
                .setTitle(embeddTitle)
                .setDescription((_d = response === null || response === void 0 ? void 0 : response.content) !== null && _d !== void 0 ? _d : response === null || response === void 0 ? void 0 : response.msg)
                .setColor(embeddColor)
                .setURL(response === null || response === void 0 ? void 0 : response.url)
                .setImage(embeddImage);
            // * ephemeral: true would only make the message visible to sender.
            if ((response === null || response === void 0 ? void 0 : response.success) === false)
                interaction.reply({ embeds: [embeddMsg], ephemeral: true });
            if ((response === null || response === void 0 ? void 0 : response.success) === true)
                interaction.reply({
                    embeds: [embeddMsg],
                    ephemeral: false,
                });
        }
        catch (e) {
            // console.log(e);
            const embeddMsg = embed
                .setTitle(`❌ **Failed Fetching Thread**`)
                .setDescription(`Something went wrong. Please try again later.`);
            interaction.reply({ embeds: [embeddMsg], ephemeral: true });
        }
    }
});
client.login(env_1.default.discordToken);
//# sourceMappingURL=app.js.map