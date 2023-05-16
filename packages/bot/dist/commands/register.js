"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const env_1 = tslib_1.__importDefault(require("../config/env"));
const commands = [
    {
        name: "authenticate",
        description: "Authenticate showwcial BOT.",
        options: [
            {
                name: "token",
                description: "Showwcial notifier token.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: "threads",
        description: "Because who doesn't want to keep up with the latest thread drama?",
    },
    {
        name: "shows",
        description: "Get your front-row seat to the latest Showwcase shows, guaranteed to make you say 'meh'.",
    },
    {
        name: "jobs",
        description: "Get the latest job openings from Showwcase, we all know you're not happy with your current one.",
    },
];
const rest = new discord_js_1.REST({ version: "9" }).setToken(env_1.default.discordToken);
async function registerCommands() {
    try {
        console.log("REGISTERING....");
        await rest.put(discord_js_1.Routes.applicationGuildCommands(env_1.default.discordClientId, env_1.default.botId), {
            body: commands,
        });
        console.log("SLASH COMMAND REGISTERING....");
    }
    catch (e) {
        console.log(e);
        console.log(`Error registering commands: ${e.message}`);
    }
}
exports.default = registerCommands;
//# sourceMappingURL=register.js.map