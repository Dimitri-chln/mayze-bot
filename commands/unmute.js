const command = {
	name: "unmute",
	description: "Unmute une personne sur le serveur",
	aliases: [],
	args: 1,
	usage: "<mention/id>",
	perms: ["MANAGE_ROLES"],
	async execute(message, args) {
		const userID = (message.mentions.users.first() || {"id": args[0]}).id;
		const member = message.guild.members.cache.get(userID);
		if (!member) {
			try { message.reply("tu n'as mentionné personne ou la mention était incorrecte"); }
			catch (err) { console.log(err); }
			return;
		}
		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		try { member.roles.remove(mutedRole.id); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en retirant le rôle"); }
			catch (err) { console.log(err); }
		}
		try { message.channel.send(`${member.user} a été unmute`); }
		catch (err) { console.log(err); }
	}
};

module.exports = command;