"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const Env = {
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordToken: process.env.DISCORD_TOKEN,
    botId: "1100925767740817428",
};
exports.default = Env;
//# sourceMappingURL=env.js.map