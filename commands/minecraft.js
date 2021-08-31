const { Message, MessageAttachment, MessageEmbed } = require("discord.js");

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
		const Minecraft = require("minecraft-server-ping");

		const isOnline = pingResult => /^Bienvenue sur le serveur de .+!$/.test(pingResult.description.text);

		Minecraft.ping("Lap1BleuKuro.aternos.me")
			.then(async res => {
				const embed = new MessageEmbed()
					.setAuthor("Serveur Minecraft de Mayze", message.client.user.avatarURL())
					.setColor(message.guild.me.displayColor)
					.setDescription(`**IP du serveur :** \`Lap1BleuKuro.aternos.me\`\n**État du serveur :** ${isOnline(res) ? "<:online:882260452627849216> `En ligne" : "<:dnd:882260897077264414> `Hors ligne"}\`${isOnline(res) ? `\n**Version :** \`${res.version.name}\`\n**Joueurs :** \`${res.players.online}/${res.players.max}\`**Ping :** \`${res.ping}ms\`` : ""}`)
					.setFooter("✨ Mayze ✨");
				
				if (isOnline(res)) embed
					.setThumbnail("attachment://favicon.png")
					.attachFiles([ new MessageAttachment(Buffer.from(res.favicon, "base64"), "favicon.png") ]);
				
				message.channel.send(embed).catch(console.error);
			})
			.catch(err => {
				console.error(err);
				message.channel.send("Quelque chose s'est mal passé en se connectant au serveur Minecraft :/").catch(console.error);
			});
	}
};

module.exports = command;