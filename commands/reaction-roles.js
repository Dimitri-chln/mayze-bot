const { Message } = require("discord.js");

const command = {
    name: "reaction-roles",
    description: "Gérer les rôles avec réaction",
    aliases: ["rroles"],
    args: 1,
    usage: "create <titre> | add <ID message> <rôle> <emoji> | remove <ID message> <rôle>",
    perms: ["MANAGE_ROLES"],
    slashOptions: [
        {
            name: "create",
            description: "Créer un nouveau message vierge",
            type: 1,
            options: [
                {
                    name: "titre",
                    description: "Le titre du message",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "add",
            description: "Ajouter un nouveau rôle",
            type: 1,
            options: [
                {
                    name: "messageID",
                    description: "L'ID du message auquel ajouter le rôle",
                    type: 3,
                    required: true
                },
                {
                    name: "rôle",
                    description: "Le rôle à ajouter",
                    type: 8,
                    required: true
                },
                {
                    name: "emoji",
                    description: "L'emoji à ajouter avec le rôle",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Retirer un rôle",
            type: 1,
            options: [
                {
                    name: "messageID",
                    description: "L'ID du message duquel retirer le rôle",
                    type: 3,
                    required: true
                },
                {
                    name: "rôle",
                    description: "Le rôle à retirer",
                    type: 8,
                    required: true
                }
            ]
        }
    ],
    /**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
        const rolesChannel = message.guild.channels.cache.get("802144513639972864");
        const subCommand = args
            ? args[0].toLowerCase()
            : options[0].name;
        
            switch (subCommand) {
                case "create":
                    const title = args
                        ? args.slice(1).join(" ")
                        : options[0].options[0].value;

                    const msg = await rolesChannel.send({
                        embed: {
                            author: {
                                name: title,
                                icon_url: message.client.user.avatarURL()
                            },
                            color: "#010101",
                            footer: {
                                text: "✨ Mayze ✨"
                            }
                        }
                    }).catch(console.error);
                    if (msg) message.channel.reply(`message créé (ID: ${msg.id})`).catch(console.error);
                    else message.channel.send("Quelque chose s'est mal passé en envoyant le message :/").catch(console.error);
                    break;
            }
    }
};

module.exports = command;