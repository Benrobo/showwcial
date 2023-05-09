import dotenv from "dotenv";
dotenv.config();

const Env = {
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordToken: process.env.DISCORD_TOKEN,
  botId: "1100925767740817428",
};

export default Env;
