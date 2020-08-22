const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.cooldowns = new Discord.Collection();

client.molkky = new Discord.Collection();

client.on("ready", () => {
  console.log("--------------------");
  console.log("BOT STARTED UP");
  const owner = client.users.cache.get(config.ownerID);
  owner.send("BOT STARTED UP");
  client.user.setActivity("le meilleur clan", { type: "WATCHING" });
});

client.on("message", message => {
  if (
    message.channel.type === "dm" &&
    message.author.id !== "703161067982946334"
  ) {
    var msg = message.content;
    if (message.attachments) {
      var attachments = message.attachments.array();
      var urls = attachments.map(attachment => attachment.url).join("\n");
      msg = msg + "\n" + urls;
    }
    const DMGuild = client.guilds.cache.get("744291144946417755");
    var channel = DMGuild.channels.cache.find(
      c => c.topic === message.author.id
    );
    if (!channel) {
      DMGuild.channels.create(message.author.username, "text").then(channel => {
        var category = DMGuild.channels.cache.get("744292272300097549");
        channel.setParent(category.id);
        channel.setTopic(message.author.id);
        channel.send(msg);
      });
    } else {
      channel.setName(message.author.username);
      channel.send(msg);
    }
  } else {
    if (
      message.channel.parentID === "744292272300097549" &&
      message.author.bot === false
    ) {
      var msg = message.content;
      if (message.attachments) {
        var attachments = message.attachments.array();
        var urls = attachments.map(attachment => attachment.url).join("\n");
        msg = msg + "\n" + urls;
      }
      client.users.cache.get(message.channel.topic).send(msg);
    } else if (
      message.author.bot === false &&
      message.content.toLowerCase().startsWith(config.prefix)
    ) {
      const input = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
      const commandName = input[0].toLowerCase();
      const args = input.splice(1);

      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );
      if (!command) return;
      if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
      }
      const now = Date.now();
      const timestamps = client.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;
      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
            .toUTCString()
            .replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
            .replace(/00h |00m /g, "");
          return message.reply(
            `attends encore **${timeLeftHumanized}** avant d'utiliser la commande \`${config.prefix}${command.name}\``
          );
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      if (args.length < command.args) {
        message.channel.send(
          `Utilisation : \`${config.prefix}${commandName} ${command.usage}\``
        );
      } else {
        try {
          command.execute(message, args);
        } catch (error) {
          console.error(error);
          message.reply(
            "quelque chose s'est mal passé en exécutant la commande :/"
          );
        }
      }
    }
  }
});

client.login(process.env.token);
