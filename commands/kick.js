const { Message } = require("discord.js");

const command = {
	name: "kick",
	description: {
		fr: "Expulser un membre du serveur",
		en: "Kick a member from the server"
	},
	aliases: [],
	args: 1,
	usage: "<user> [<reason>]",
	perms: ["KICK_MEMBERS"],
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "user",
			description: "The user to kick",
			type: 6,
			required: true
		},
        {
            name: "reason",
            description: "The reason",
            type: 3,
            required: false
        }
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const { OWNER_ID } = require("../config.json");
		
		const member = args
            ? message.mentions.members.first() || message.guild.members.cache.get(args[0])
            : message.guild.members.cache.get(options[0].value);
        if (!member) return message.reply("mentionne un membre du serveur").catch(console.error);
        const reason = args
            ? args.slice(1).join(" ") || null
            : options[1] ? options[1].value : null;

        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== OWNER_ID) 
			return message.reply("tu ne peux pas expulser cette personne").catch(console.error);

        // Server booster
        if (member.premiumSince) return message.reply("ce membre boost le serveur").catch(console.error);

		if (member.roles.highest.rawPosition >= message.guild.me.roles.highest.rawPosition)
			return message.reply(`je ne suis pas assez haut dans la hiérarchie pour expulser **${member.user.tag}**`).catch(console.error);

        member.kick(`Expulsé par ${message.author.tag}${reason ? `. Raison : ${reason}` : ""}`)
            .then(m => message.channel.send(`**${m.user.tag}** a été éxpulsé`).catch(console.error))
            .catch(err => {
                console.error(err);
                message.channel.send("Quelque chose s'est mal passé en expulsant ce membre :/").catch(console.error);
            });
	}
};

module.exports = command;