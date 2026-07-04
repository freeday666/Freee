const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const app = express();
app.use(express.json());

let bot;
let client;

let config = {
  token: "",
  guildId: "",
  logChannelName: "logs"
};

// START BOT
async function startBot(token) {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.once("ready", async () => {
    console.log("Bot started");

    const guild = client.guilds.cache.get(config.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.find(c => c.name === config.logChannelName);

    if (channel) {
      const embed = new EmbedBuilder()
        .setTitle("🟢 Bot Started")
        .setDescription(`Bot is online as ${client.user.tag}`)
        .setColor("Green")
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  });

  client.on("messageCreate", (msg) => {
    if (msg.content === "!ping") {
      msg.reply("Pong 🏓");
    }
  });

  await client.login(token);
}

// STOP BOT
async function stopBot() {
  if (client) {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const channel = guild.channels.cache.find(c => c.name === config.logChannelName);

      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("🔴 Bot Stopped")
          .setDescription("Bot is offline")
          .setColor("Red")
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }
    }

    client.destroy();
    client = null;
  }
}

// API (from dashboard)
app.post("/start", async (req, res) => {
  config = req.body;
  await startBot(config.token);
  res.send("Bot started");
});

app.post("/stop", async (req, res) => {
  await stopBot();
  res.send("Bot stopped");
});

app.listen(3000, () => console.log("Control server running"));
