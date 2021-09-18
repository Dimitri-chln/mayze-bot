const { Message, MessageAttachment, MessageEmbed } = require("discord.js");
const Minecraft = require("minecraft-server-ping");
const pagination = require("../utils/pagination");

const command = {
	name: "minecraft",
	description: "Obtenir des informations sur le serveur Minecraft de Mayze",
	aliases: ["mc"],
	args: 0,
	usage: "",
	onlyInGuilds: ["689164798264606784"],
	botPerms: ["EMBED_LINKS"],
	category: "miscellaneous",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const isOnline = pingResult => /^Bienvenue sur le serveur de .+!$/.test(pingResult.description.text);

		const serverIPs = process.env.MINECRAFT_SERVER_IPS.split(",");

		let pages = [], embed;

		await Promise.all(
			serverIPs.map(async serverIP => {
				const res = await Minecraft.ping(serverIP).catch(console.error);
				if (res) {
					console.log(res);
					embed = new MessageEmbed()
						.setAuthor("Serveurs Minecraft", message.client.user.avatarURL())
						.setColor(message.guild.me.displayColor)
						.setDescription(`**IP du serveur :** \`${serverIP}\`\n**État du serveur :** ${isOnline(res) ? "<:online:882260452627849216> `En ligne" : "<:dnd:882260897077264414> `Hors ligne"}\`${isOnline(res) ? `\n**Version :** \`${res.version.name}\`\n**Joueurs :** \`${res.players.online}/${res.players.max}\`**Ping :** \`${res.ping}ms\`` : ""}`);
					if (isOnline(res)) {
						embed
							.attachFiles([ new MessageAttachment(Buffer.from(res.favicon, "base64"), "favicon.png") ])
							.setThumbnail("attachment://favicon.png");
					}
					pages.push(embed);
				} else {
					message.channel.send("Quelque chose s'est mal passé en se connectant au serveur Minecraft :/").catch(console.error);
				}
			})
		);

		pagination(message, pages).catch(err => {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		});
	}
};

module.exports = command;