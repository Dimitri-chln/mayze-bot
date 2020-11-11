const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
require('dotenv').config();
const dataRead = require("./functions/dataRead.js");
const dataWrite = require("./functions/dataWrite.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.autoresponses = [];
const autoresponseFiles = fs
  .readdirSync("./autoresponses")
  .filter(file => file.endsWith(".js"));
for (const file of autoresponseFiles) {
  const autoresponse = require(`./autoresponses/${file}`);
  client.autoresponses.push(autoresponse);
}

client.reactionCommands = [];
const reactionCommandsFiles = fs
  .readdirSync("./reactionCommands")
  .filter(file => file.endsWith(".js"));
for (const file of reactionCommandsFiles) {
  const reactionCommand = require(`./reactionCommands/${file}`);
  client.reactionCommands.push(reactionCommand);
}

client.cooldowns = new Discord.Collection();
client.molkky = new Discord.Collection();
client.russianRoulette = [];
client.dmChannels = new Discord.Collection();
client.werewolfPlayers = new Discord.Collection();

try {
  const pokedex = require("./database/pokedex.json");
  var pokedexWeight = [0];
  for (var i = 0; i < pokedex.length; i++) {
    pokedexWeight.push(pokedexWeight[i] + pokedex[i].drop);
  };
  client.pokedexWeight = pokedexWeight;
} catch (err) {
  client.herokuMode = true;
};

client.on("ready", () => {
  const logChannel = client.channels.cache.get(config.logChannel);
  client.logChannel =logChannel;
  var herokuText = "";
  var mode = "Classique";
  console.log("--------------------");
  console.log("BOT STARTED UP");
  if (client.herokuMode) {
    console.log("RUNNING ON HEROKU MODE");
    herokuText = " - Mode Heroku";
    mode = "Heroku";
  };
  console.log("--------------------");
  const { version } = require ("./package.json");
  logChannel.send({
    embed: {
      author: {
        name: "Démarrage du bot...",
        icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
      },
      color: "#010101",
      description: `• **Version:** \`${version}\`\n• **Ping:** Calcul...\n• **Mode:** ${mode}`,
      footer: {
        text: "✨ Mayze ✨"
      },
      timestamp: Date.now()
    }
  }).then(msg => {
      const embed = new Discord.MessageEmbed(msg.embeds[0]);
      msg.edit(embed.setDescription(`• **Version:** \`${version}\`\n• **Ping:** \`${Math.abs(Date.now() - msg.createdTimestamp)}ms\`\n• **Mode:** ${mode}`));
  }).catch(err => console.log(err));
  client.user.setActivity("le meilleur clan", { type: "WATCHING" });
});

client.on("message", message => {
  if (message.partial) return;
  if (message.channel.partial) return;
  if (message.content.toLowerCase().startsWith(config.prefix[client.user.id])) {
    if (message.author.bot) return;
    const input = message.content
      .slice(config.prefix[client.user.id].length)
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

    if (
      command.perms &&
      !command.perms.every(perm => message.member.hasPermission(perm))
    )
      return message.reply(`tu n'as pas les permissions nécessaires \n→ \`${command.perms.join("`, `")}\``);

    if (command.ownerOnly && message.author.id !== config.ownerID) return;

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
          .toUTCString()
          .replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
          .replace(/00h |00m /g, "");
        return message.reply(
          `attends encore **${timeLeftHumanized}** avant d'utiliser la commande \`${
            config.prefix[client.user.id]
          }${command.name}\``
        );
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (args.length < command.args) {
      message.channel.send(
        `Utilisation : \`${config.prefix[client.user.id]}${commandName} ${
          command.usage
        }\``
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

  for (const autoresponse of client.autoresponses) {
    try {
      autoresponse.execute(message);
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.partial) {
    try {
      reaction.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      return;
    }
  }
  if (user.bot) return;
  for (const reactionCommand of client.reactionCommands) {
    try {
      reactionCommand.execute(reaction, user);
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("guildMemberAdd", async member => {
    const roles = ["759694957132513300", "735810462872109156", "735810286719598634", "735809874205737020", "735811339888361472"];
    roles.forEach(r => {
        try {
            member.roles.add(r);
        } catch (err) {
            console.log(err);
        }
    });
    var joinTimestamps = await dataRead("joinTimestamps.json");
    var memberTimestamp = joinTimestamps[member.user.id];
    if (!memberTimestamp) {
        memberTimestamp = { "joined": Date.now(), "left": null };
        joinTimestamps[member.user.id] = memberTimestamp;
        dataWrite("joinTimestamps.json", joinTimestamps);
        member.user.send({
            embed: {
                author: {
                    name: member.user.tag,
                    icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
                },
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                },
                title: "Bienvenue sur Mayze !",
                color: "#010101",
                description: "Amuse-toi bien sur le serveur 😉",
                footer: {
                    text: "✨ Mayze ✨"
                }
            }
        });
    }
});

client.login(process.env.TOKEN);
