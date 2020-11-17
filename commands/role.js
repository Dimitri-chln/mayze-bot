const command = {
	name: "role",
	description: "Obtiens des informations sur un rôle",
	aliases: [],
	args: 1,
	usage: "<rôle>",
	perms: ["MANAGE_ROLES"],
	execute(message, args) {
		const roleIdOrName = args.join(" ").toLowerCase();
		const role = message.guild.roles.cache.get(roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.replace(/[<@&>\W]/, "").toLowerCase() === roleIdOrName) ||
			message.guild.roles.cache.find(r =>r.name.toLowerCase().includes(roleIdOrName));

		if (!role) {
			try {
				message.reply("je n'ai pas réussi à trouver ce rôle"); }
			catch (err) { console.log(err); }
		}

		const hexColor = Math.floor(role.color / (256 * 256)).toString(16).replace(/(^.$)/, "0$1") +
			Math.floor((role.color % (256 * 256)) / 256).toString(16).replace(/(^.$)/, "0$1") +
			(role.color % 256).toString(16).replace(/(^.$)/, "0$1");
		const roleMembers = role.members.filter(m => m.roles.cache.has(role.id)).map(m => m.user.username);

		try {
			message.channel.send({
				embed: {
					author: {
						name: role.name,
						icon_url: `https://dummyimage.com/50/${hexColor}/${hexColor}`
					},
					color: "#010101",
					description: `**ID:** \`${role.id}\`\n**Couleur** (dec)**:** \`${role.color}\`\n**Couleur** (hex)**:** \`#${hexColor}\`\n**Position:** \`${role.position}\`\n**Membres:** \`${roleMembers.length}\`\n\`\`\`${roleMembers.join(", ") || " "}\`\`\``,
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;