const { Message } = require("discord.js");

const command = {
	name: "channel-names",
	description: "Modifier le nom de tous les salons en une seule commande",
	aliases: ["channelNames", "cn"],
	args: 2,
	usage: "\"<regex>\" \"<remplacement>\" [type]",
	perms: ["ADMINISTRATOR"],
	slashOptions: [
		{
			name: "regex",
			description: "Le regex à appliquer à tous les salons",
			type: 3,
			required: true
		},
		{
			name: "remplacement",
			description: "Ce par quoi remplacer le texte correspondant au regex donné",
			type: 3,
			required: true
		},
		{
			name: "type",
			description: "le type de salon à modifier → text, voice, category",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const userValidation = require("../utils/userValidation");
		const type = args
			? args[2]
			: (options[2] || {}).value;
		const channels = message.guild.channels.cache
			.filter(c => c.type === (type || "text") || c.type === (type || "voice"))
			.sort((a, b) => {
				if (a.type === "text" && b.type === "voice") return -1;
				if (a.type === "voice" && b.type === "text") return 1;
				return a.rawPosition - b.rawPosition;
			});
		const regex = args
			? new RegExp(args[0], "g")
			: new RegExp(options[0].value, "g");
		const replace = args
			? args[1]
			: options[1].value;
		const newChannels = channels.map(c => c.name.replace(regex, replace));
		const msg = await message.channel.send({
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
		}).catch(console.error);
		if (!msg) return message.channel.send("Le message est trop long pour que je puisse l'envoyer :/").catch(console.error);

		const validation = await userValidation(message.author, msg);
		if (!validation) return message.channel.send("Procédure annulée").catch(console.error);
		const loadingMsg = await message.channel.send(`Modification de ${channels.size} salons...`).catch(console.error);
		let errors = 0;
		await channels.forEach(async c => {
			c.setName(c.name.replace(regex, replace)).catch(err => {
				++errors;
				console.error(err);
			});
		});
		loadingMsg.edit(`${channels.size - errors} salons ont été modifiés ! (${errors} erreur(s))`);
	}
};

module.exports = command;