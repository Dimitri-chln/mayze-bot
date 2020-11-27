const command = {
	name: "unmute",
	description: "Unmute une personne sur le serveur",
	aliases: [],
	args: 1,
	usage: "<mention/id>",
	perms: ["MANAGE_ROLES"],
	hierarchy: true,
	async execute(message, args) {
		const { ownerID } = require("../config.json");
		const userID = (message.mentions.users.first() || {"id": args[0]}).id;
		const member = message.guild.members.cache.get(userID);
		if (!member) {
			return message.reply("tu n'as mentionné personne ou la mention était incorrecte").catch(console.error);
		}
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== ownerID) {
			return message.reply("tu ne peux pas unmute cette personne").catch(console.error);
		};

		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		try { member.roles.remove(mutedRole.id); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en retirant le rôle").catch(console.error);
		}
		message.channel.send(`${member.user} a été unmute`).catch(console.error);
	}
};

module.exports = command;