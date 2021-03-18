const { Message } = require("discord.js");

const command = {
	name: "role",
	description: "Obtenir des informations sur un rôle",
	aliases: [],
	args: 1,
	usage: "<rôle>",
	slashOptions: [
		{
			name: "rôle",
			description: "Le rôle dont tu veux obtenir des informations",
			type: 8,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const role = args
			? message.guild.roles.cache.get(args.join(" ").toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.roles.cache.find(r =>r.name.toLowerCase().includes(args.join(" ").toLowerCase()))
			: message.guild.roles.cache.get(options[0].value);
		if (!role) return message.reply("je n'ai pas réussi à trouver ce rôle").catch(console.error);

		const roleMembers = role.members.map(m => m.user.username);

		const hexColor = Math.floor(role.color / (256 * 256)).toString(16).replace(/^(.)$/, "0$1") + Math.floor((role.color % (256 * 256)) / 256).toString(16).replace(/^(.)$/, "0$1") + (role.color % 256).toString(16).replace(/^(.)$/, "0$1");

		message.channel.send({
			embed: {
				author: {
					name: role.name,
					icon_url: `https://dummyimage.com/50/${hexColor}/${hexColor}.png?text=+`
				},
				color: message.guild.me.displayHexColor,
				description: `**ID:** \`${role.id}\`\n**Couleur** (dec)**:** \`${role.color}\`\n**Couleur** (hex)**:** \`#${hexColor}\`\n**Position:** \`${role.position}\`\n**Membres:** \`${roleMembers.length}\`\n\`\`\`\n${roleMembers.join(", ") || " "}\n\`\`\``,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;