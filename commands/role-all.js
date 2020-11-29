const command = {
	name: "role-all",
	description: "Donne ou retire un rôle à tous les membres",
	aliases: ["ra"],
	cooldown: 30,
	args: 2,
	usage: "add/remove <rôle> [-bot] [-human]",
	perms: ["MANAGE_ROLES"],
	async execute(message, args) {
		const userValidation = require("../modules/userValidation.js");
		const roleIdOrName = args[1].toLowerCase();
		const role = message.guild.roles.cache.get(roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase() === roleIdOrName) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase().includes(roleIdOrName));
		if (!role) return message.reply("je n'ai pas réussi à trouver ce rôle").catch(console.error);

		var response = `Le rôle \`${role.name}\` sera`;
		if (args[0].toLowerCase() === "add") response += " ajouté à";
		else if (args[0].toLowerCase() === "remove") response += " retiré de";
		else return message.reply("le premier argument est incorrect!").catch(console.error);

		if (args.includes("-bot")) response += " tous les bots.";
		else if (args.includes("-human")) response += " tous les utilisateurs.";
		else response += " tout le monde.";

		const msg = await message.channel.send(`${response} Veux-tu continuer?`).catch(console.error);
		try {
			const validation = await userValidation(message, msg);
			if (!validation) {
				return message.channel.send("Procédure annulée").catch(console.error);
			}
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé avec la validation :/").catch(console.error);
		}

		msg.edit("Récupération des membres...").catch(console.error);
		await message.guild.members.fetch();

		const members = message.guild.members.cache;

		if (args.includes("-bot")) {
			members = members.filter(m => m.user.bot);
		} else if (args.includes("-human")) {
			members = members.filter(m => !m.user.bot);
		}

		var errors = 0;
		msg.edit(`Mise à jour de ${members.size} membre(s)...`).catch(console.error);

		switch (args[0].toLowerCase()) {
			case "add":
				members = members.filter(m => !m.roles.cache.has(role.id));
				await members.forEach(async member => {
					try { member.roles.add(role); }
					catch (err) {
						console.log(err);
						errors ++;
					}
				});
				break;
			case "remove":
				members = members.filter(m =>m.roles.cache.has(role.id));
				await members.forEach(async member => {
					try { member.roles.remove(role) }
					catch (err) {
						console.log(err);
						errors ++;
					}
				});
				break;
			default:
				message.reply("arguments incorrects !").catch(console.error);
		}
		try {
			const text = `${members.size - errors} membres ont été mis à jour ! (${errors} erreurs)`
				.replace(/(1 \w+)s/g, "$1")
				.replace(/0 (\w+)s ont/g, "Aucun $1 n'a")
				.replace(/(1 \w+) ont/g, "$1 a")
				.replace(/0 (\w+)s/g, "Aucune $1");
			msg.edit(text);
		} catch (err) { console.log(err); }
	}
};

module.exports = command;