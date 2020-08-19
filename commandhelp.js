module.exports = {
    name: "commandhelp",
    description: "Obtiens la liste complète des commandes ou des informations sur une commande spécifique",
    aliases: ["command","cmdhelp", "cmd"],
    args: 0,
    usage: "[commande]",
    execute(message, args) {
        const prefix = require("../config.json").prefix;
        var data;
        const commands = message.client.commands;
        
        if (!args.length) {
            data = commands.map(cmd => cmd.name).join(", ");
            message.author.send({
                embed: {
                    title: "__Liste automatisée des commandes:__",
                    color: "#010101",
                    description: data,
                    footer: {
                        text: "✨Mayze✨",
                    }
                }
            })
            .then(() => {
                message.reply("check tes DM !")})
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply("on dirait que je ne peux pas te DM! As-tu désactivé les DM?");
            });
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if (!command) {
                return message.reply("cette commande n'existe pas!");
            };
            data = (`**Nom:** ${command.name}`);
            if (command.aliases.length) {data = data + (`\n**Aliases:** ${command.aliases.join(", ")}`);};
            if (command.description) {data = data + (`\n**Description:** ${command.description}`);};
            if (command.usage) {data = data + (`\n**Utilisation:** ${prefix}${command.name} ${command.usage}`);};
            data = data + (`\n**Cooldown:** ${command.cooldown || 3} seconde(s)`);
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
        };
    }
};