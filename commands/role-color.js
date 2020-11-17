const command = {
	name: "role-color",
	description: "Change la couleur d'un rôle",
	aliases: ["roleColor", "rc"],
	args: 2,
	usage: "<rôle/id> <couleur>",
	perms: ["MANAGE_ROLES"],
	async execute(message, args) {
		const roleIdOrName = args[0].toLowerCase();
		const role =
			message.guild.roles.cache.get(roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase() === roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase().includes(roleIdOrName));
		if (!role) {
			try { message.reply("je n'ai pas réussi à trouver ce rôle"); }
			catch (err) { console.log(err); }
		}

		try { await role.setColor(args[1]); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en changeant la couleur du rôle"); }
			catch (err) { console.log(err); }
			return;
		}
		try {
			message.channel.send({
				embed: {
					auhtor: {
						name: "Couleur modifiée avec succès",
						icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
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