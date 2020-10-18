module.exports = {
  name: "reload",
  description: "Recharge une commande spécifique",
  aliases: ["rl"],
  args: 1,
  usage: "<commande>",
  ownerOnly: true,
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command)
      return message.channel.send(
        `Il n'y a pas de commandes ayant pour nom ou alias \`${commandName}\`, ${message.author}!`
      );
    delete require.cache[require.resolve(`./${command.name}.js`)];
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`La commande \`${command.name}\` a été rechargée !`);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`\`\`${error.message}\`\`\``
      );
    };
  }
};
