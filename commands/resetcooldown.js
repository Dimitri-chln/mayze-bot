module.exports = {
  name: "resetcooldown",
  description: "Réinitialise le cooldown d'une commande pour une personne",
  aliases: ["resetcd", "rcd"],
  args: 2,
  usage: "<mention/id> <commande>",
  ownerOnly: true,
  execute(message, args) {
    const userID = args[0].replace(/[<@!>]/g, "");
    const commandName = args[1].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command)
      return message.channel.send(
        `Il n'y a pas de commandes ayant pour nom ou alias \`${commandName}\`, ${message.author}!`
      );
    const timestamps = message.client.cooldowns.get(command.name);
    if (!timestamps)
      return message.reply(
        "il n'y a pas de cooldown actif pour cette commande!"
      );
    if (timestamps.has(userID)) {
      timestamps.delete(userID);
    }
    message.channel.send(
      `Le cooldown de la commande \`${command.name}\` a été réinitialisé pour <@${userID}>`
    );
  }
};
