const command = {
	name: "channel-names",
	description: "Modifie le nom de tous les salons en une seule commande",
	aliases: ["channelNames", "cn"],
	args: 2,
	usage: "<regex> <remplacement> [type]",
	perms: ["ADMINISTRATOR"],
	async execute(message, args) {
		const userValidation = require("../modules/userValidation.js");
		const channels = message.guild.channels.cache
		.filter(c => c.type === (args[2] || "text") || c.type === (args[2] || "voice"))
		.sort(function(a, b) {
			if (a.type === "text" && b.type === "voice") return -1;
			if (a.type === "voice" && b.type === "text") return 1;
			return a.rawPosition - b.rawPosition;
		});
		const regex = new RegExp(args[0], "g");
		const replace = args[1];
		const newChannels = channels.map(c => c.name.replace(regex, replace));
		var msg;
		try {
			msg = await message.channel.send({
				embed: {
					author: {
						name: "Vérification avant changement",
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					thumbnail: {
						url: message.client.user.avatarURL()
					},
					title: "• Voici à quoi ressembleront les salons après modification. Veux-tu continuer?",
					color: "#010101",
					description: newChannels.join("\n"),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			});
		} catch (err) { console.log(err);
			return message.channel.send("Le message est trop long pour que je puisse l'envoyer :/").catch(console.error);
		}
		const validation = await userValidation(message, msg);
		if (!validation) {
			return message.channel.send("Procédure annulée").catch(console.error);
		}
		try {
			const loadingMsg = await message.channel.send(`Modification de ${channels.size} salons...`);
			var errors = 0;
			await channels.forEach(async c => {
				try { c.setName(c.name.replace(regex, replace)); }
				catch (err) {
					console.log(err);
					errors ++;
				}
			});
			loadingMsg.edit(`${channels.size - errors} salons ont été modifiés ! (${errors} erreur(s))`);
		} catch (err) { console.log(err); }
	}
};

module.exports = command;