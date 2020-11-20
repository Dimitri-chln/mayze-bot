const command = {
	name: "mute",
	description: "Mute une personne sur le serveur pendant un temps donné",
	aliases: [],
	args: 1,
	usage: "<mention/id> [durée]",
	perms: ["MANAGE_ROLES"],
	async execute(message, args) {
		const dhms = require ("dhms");
		const dateToString = require("../modules/dateToString.js");
		
		const userID = (message.mentions.users.first() || {id: args[0]}).id;
		const member = message.guild.members.cache.get(userID);
		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		
		if (!member) {
			return message.reply("tu n'as mentionné personne ou la mention était incorrecte").catch(console.error);
		}
		if (member.roles.highest.position >= message.member.roles.highest.position) {
			return message.reply("tu ne peux pas mute cette personne").catch(console.error);
		};
		
		const duration = args.slice(1).join(" ");
		var durationResponse = "indéfiniment";
		if (duration) {
			const durationHumanized = dateToString(dhms(duration, true));
			if (durationHumanized) {
				durationResponse = `pendant ${durationHumanized}`;
				setTimeout(function() {
					try { member.roles.remove(mutedRole.id); }
					catch (err) { console.log(err); }
				}, duration * 1000);
			};
		};
		try { member.roles.add(mutedRole.id); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en ajoutant le rôle Muted").catch(console.error);
		}
		message.channel.send(`${member.user} a été mute ${durationResponse}`).catch(console.error);
	}
};

module.exports = command;