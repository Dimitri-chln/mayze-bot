const { Message } = require("discord.js");

const command = {
	name: "role-color",
	description: {
		fr: "Changer la couleur d'un rôle",
		en: "Change the color of a role"
	},
	aliases: ["rolecolor", "rc"],
	args: 2,
	usage: "<role> <color>",
	perms: ["MANAGE_ROLES"],
	botPerms: ["EMBED_LINKS", "MANAGE_ROLES"],
	category: "utility",
	slashOptions: [
		{
			name: "role",
			description: "The role you want to edit",
			type: 8,
			required: true
		},
		{
			name: "color",
			description: "The new color to apply to the role (#xxyyzz)",
			type: 3,
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
			? message.guild.roles.cache.get(args[0].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[0].toLowerCase()))
			: message.guild.roles.cache.get(options[0].value);
		if (!role) return message.reply(language.invalid_role).catch(console.error);
		const color = args
			? args[1]
			: options[1].value;
		if (!/#[\dabcdef]{6}/.test(color)) return message.reply(language.invalid_color).catch(console.error);

		const r = await role.setColor(color).catch(console.error);
		if (!r) return message.channel.send(language.errors.role_color).catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: language.title,
					icon_url: message.client.user.displayAvatarURL()
				},
				thumbnail: {
					url: `https://dummyimage.com/50/${color.replace("#", "")}/${color.replace("#", "")}.png?text=+`
				},
				color: message.guild.me.displayColor,
				description: language.get(language.changed, role, color.toLowerCase()),
			footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;