module.exports = {
  name: "command-help",
  description:
    "Obtiens la liste complète des commandes ou des informations sur une commande spécifique",
  aliases: ["commandHelp", "command", "cmdhelp", "cmd"],
  args: 0,
  usage: "[commande]",
  execute(message, args) {
    const prefix = require("../config.json").prefix[message.client.user.id];
    var data;
    const commands = message.client.commands;

    if (!args.length) {
      data = commands.filter(cmd => !cmd.ownerOnly).map(cmd => cmd.name).join(", ");
      message.author
        .send({
          embed: {
            author: {
              name: "Liste automatisée des commandes",
              icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
            },
            color: "#010101",
            description: data,
            footer: {
              text: "✨Mayze✨"
            }
          }
        })
        .then(() => {
          message.reply("check tes DM !");
        })
        .catch(error => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "on dirait que je ne peux pas te DM! As-tu désactivé les DM?"
          );
        });
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find(c => c.aliases && c.aliases.includes(name));
      if (!command) {
        return message.reply("cette commande n'existe pas!");
      };
      data = `**Nom:** \`${command.name}\``;
      if (command.aliases.length) {
        data = data + `\n**Aliases:** \`${command.aliases.join("`, `")}\``;
      };
      if (command.description) {
        data = data + `\n**Description:** ${command.description}`;
      };
      if (command.usage) {
        data = data + `\n**Utilisation:** \`${prefix}${command.name} ${command.usage}\``;
      };
      if (command.perms) {
        data = data + `\n**Permissions:** \`${command.perms.join("`, `")}\``;
      };
      if (command.ownerOnly) {
        data = data + `\nCette commande n'est utilisable que par ${message.client.owner.username}`;
      };
      data = data + `\n**Cooldown:** ${command.cooldown || 3} seconde(s)`;
      message.channel.send({
        embed: {
          title: "__Message d'aide automatisé__",
          color: "#010101",
          description: data,
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    }
  }
};
