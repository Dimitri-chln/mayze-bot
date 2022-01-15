const { Message } = require("discord.js");

const command = {
	name: "quest",
	description: "Afficher un message de vote pour les quêtes WWO",
	aliases: [],
	args: 0,
	usage: "[-everyone] [-single] [-noping] [-votes <nombre de votes>]",
	onlyInGuilds: ["689164798264606784"],
	perms: ["ADMINISTRATOR"],
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	category: "wolvesville",
	disableSlash: true,
	/**
	 * @param {Message} message
	 * @param {string[]} args
	 * @param {Object[]} options
	 */
	run: async (message, args, options, language, languageCode) => {
		if (!message.member.roles.cache.some(r => ["696751614177837056", "696751852267765872"].includes(r.id))) return;
		if (!["707304882662801490", "689212233439641649"].includes(message.channel.id))
			return message.react("❌").catch(console.error);
	
		const questChannel = message.client.channels.cache.get("689385764219387905");

		const imageURL = (message.attachments.first() || {}).url;
		if (!imageURL) return message.reply("ajoute une image à ton message").catch(console.error);
		
		const allowed = args.includes("-everyone") ? "Tout le monde" : "Membres uniquement";
		const votes = args.includes("-single") ? "Un seul vote" : "Plusieurs votes";
		const messageContent = args.includes("-noping") ? "" : "<@&689169027922526235>";
		const reactionsNumber = args.includes("-votes") ? parseInt(args[args.indexOf("-votes") + 1]) || 3 : 3;
		
		const msg = await questChannel.send({
				content: messageContent,
				embed: {
					title: "Nouvelles quêtes disponibles!",
					color: message.guild.me.displayColor,
					image: {
						url: imageURL
					},
					footer: {
						text: `${allowed} - ${votes}`
					}
				}
			}).catch(err => {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en envoyant le message :/").catch(console.error);
		});
		
		const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].slice(0, reactionsNumber);
		emojis.forEach(async e => await msg.react(e).catch(console.error));
		await msg.react("🔄").catch(console.error);

		message.react("✅").catch(console.error);
	}
};

module.exports = command;