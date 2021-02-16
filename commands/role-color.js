const { Message } = require("discord.js");

const command = {
	name: "role-color",
	description: "Changer la couleur d'un rôle",
	aliases: ["roleColor", "rc"],
	args: 2,
	usage: "<rôle/id> <couleur>",
	perms: ["MANAGE_ROLES"],
	slashOptions: [
		{
			name: "rôle",
			description: "Le rôle dont tu veux modifier la couleur",
			type: 8,
			required: true
		},
		{
			name: "color",
			description: "La nouvelle couleur du rôle",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, languages, language) => {
		const role = args
			? message.guild.roles.cache.get(args[0].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[0].toLowerCase()))
			: message.guild.roles.cache.get(options[0].value);
		if (!role) return message.reply("ce rôle n'existe pas").catch(console.error);
		const color = args
			? args[1]
			: options[1].value;

		const r = await role.setColor(color).catch(console.error);
		if (!r) return message.channel.send("Quelque chose s'est mal passé en changeant la couleur du rôle :/").catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: "Couleur modifiée avec succès",
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: `https://dummyimage.com/50/${color.replace("#", "")}/${color.replace("#", "")}.png?text=+`
				},
				color: "#010101",
				description: `La couleur du rôle ${role} a été changée en \`${color.toLowerCase()}\``,
			footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;