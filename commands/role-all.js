const { MessageFlags } = require("discord.js");

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
		if (!role) {
			try { message.reply("je n'ai pas réussi à trouver ce rôle"); }
			catch (err) { console.log(err); }
			return;
		}

		var response = `Le rôle \`${role.name}\` sera`;
		if (args[0].toLowerCase() === "add") response += " ajouté à";
		else if (args[0].toLowerCase() === "remove") response += " retiré de";
		else {
			try { message.reply("le premier argument est incorrect!"); }
			catch (err) { console.log(err); }
			return;
		}
		if (args.includes("-bot")) response += " tous les bots.";
		else if (args.includes("-human")) response += " tous les utilisateurs.";
		else response += " tout le monde.";

		var msg;
		try { msg = await message.channel.send(`${response} Veux-tu continuer?`); }
		catch (err) { console.log(err); }
		try {
			const validation = await userValidation(message, msg);
			if (!validation) {
				try { message.channel.send("Procédure annulée"); }
				catch (err) { console.log(err); }
				return;
			}
		} catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé avec la validation :/"); }
			catch (err) { console.log(err); }
			return;
		}

		try { msg.edit("Récupération des membres..."); }
		catch (err) { console.log(err); }

		var members = message.guild.members.cache;
		try { members = await message.guild.members.fetch(); }
		catch (err) { console.log(err); }

		if (args.includes("-bot")) {
			members = members.filter(m => m.user.bot);
		} else if (args.includes("-human")) {
			members = members.filter(m => !m.user.bot);
		}

		var errors = 0;
		try { msg.edit(`Mise à jour de ${members.size} membre(s)...`); }
		catch (err) { console.log(err); }

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
				try { message.reply("arguments incorrects !"); }
				catch (err) { console.log(err); }
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