const { Message } = require("discord.js");

const command = {
	name: "role-color",
	description: "Change la couleur d'un rôle",
	aliases: ["roleColor", "rc"],
	args: 2,
	usage: "<rôle/id> <couleur>",
	perms: ["MANAGE_ROLES"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const roleIdOrName = args[0].toLowerCase();
		const role =
			message.guild.roles.cache.get(roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase() === roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase().includes(roleIdOrName));
		if (!role) return message.reply("je n'ai pas réussi à trouver ce rôle").catch(console.error);
		const color = args[1].replace(/#/, "");

		try { await role.setColor(args[1]); }
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en changeant la couleur du rôle").catch(console.error);
		}
		try {
			message.channel.send({
				embed: {
					author: {
						name: "Couleur modifiée avec succès",
						icon_url: message.client.user.avatarURL()
					},
					thumbnail: {
						url: `https://dummyimage.com/50/${color}/${color}.png`
					},
					color: "#010101",
					description: `La couleur du rôle ${role} a été changée en ${args[1]}`,
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;