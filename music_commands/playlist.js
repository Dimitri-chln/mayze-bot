const { Message } = require("discord.js");

const command = {
	name: "playlist",
	description: "Sauvegarder et jouer des playlists",
	aliases: ["plist", "pl"],
	args: 0,
	usage: "get [-me] | play <nom> [-shuffle] | add <nom> <url> [-private] | remove <nom>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {		
		const subCommand = args
			? args.length ? args[0].toLowerCase() : "get"
			: options[0].name;
		const playlistName = args
			? args[1]
			: options[0].options[0].value;
		
		const { "rows": playlists } = await message.client.pg.query(`SELECT * FROM playlists WHERE private = false OR user_id = '${message.author.id}'`).catch(console.error);
		
		switch (subCommand) {
			case "get": {
				const me = args
					? args.includes("-me")
					: options[0].options[0].value === "-me";
				
				message.channel.send({
					embed: {
						author: {
							name: `Playlists de ${me ? message.author.tag : message.guild.name}`,
							icon_url: me ? message.author.avatarURL({ dynamic: true }) : message.client.user.avatarURL()
						},
						color: "#010101",
						description: playlists.filter(p => me ? p.user_id === message.author.id : p).map(playlist => `[${playlist.name}](${playlist.url}) - **${(message.guild.members.cache.get(playlist.user_id) || { user: { tag: "*Inconnu*" } }).user.tag}**${playlist.private ? " - 🚫" : ""}`).join("\n") || "*Pas de playlist*",
						footer: {
							text: "✨Mayze✨" + (playlists.some(p => p.private) ? " | 🚫 signifie que la playlist est privée" : "")
						}
					}
				}).catch(console.error);
				break;
			}
			case "play": {
				if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);
				const isPlaying = message.client.player.isPlaying(message.guild.id);

				const shuffle = args
					? args.includes("-shuffle")
					: options[0].options[1].value === "-shuffle";
				
				const playlist = playlists.find(p => p.name === playlistName);
				if (!playlist) return message.reply("il n'y a pas de playlist avec ce nom ou elle est privée").catch(console.error);

				message.channel.startTyping(1);
				const res = await message.client.player.playlist(message.guild.id, playlist.url, message.member.voice.channel, -1, message.author, shuffle);
				if (!res.playlist) {
					console.error(res.error);
					return message.channel.send("Quelque chose s'est mal passé en récupérant la playlist :/").catch(console.error);
				}

				message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist ajoutée${shuffle ? " et mélangée" : ""}**\n> ${res.playlist.videoCount} musiques ont été ajoutées à la queue`).catch(console.error);
				if (!isPlaying) message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${res.song.name}`).catch(console.error);
				message.channel.stopTyping();
				break;
			}
			case "add": {
				const { rows } = await message.client.pg.query(`SELECT * FROM playlists WHERE name = '${playlistName}'`).catch(console.error);
				if (rows.length) return message.reply("une playlist avec ce nom existe déjà").catch(console.error);

				const url = args
					? args[2]
					: options[0].options[1].value;
				if (!playlistName) return message.reply("ajoute un nom pour la playlist").catch(console.error);
				if (!url) return message.reply("ajoute l'URL de la playlist").catch(console.error);

				const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
				const spotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;
				if (!playlistRegex.test(url) && !spotifyPlaylistRegex.test(url)) return message.reply("l'URL est invalide").catch(console.error);

				const private = args
					? args.includes("-private")
					: options[0].options[2].value === "-private";

				const res = await message.client.pg.query(`INSERT INTO playlists VALUES ('${playlistName}', '${url}', '${message.author.id}', ${private})`).catch(console.error);
				if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);

				message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist créée**`).catch(console.error);
				break;
			}
			case "remove": {
				if (!playlistName) return message.reply("ajoute le nom de la playlist").catch(console.error);

				const res = await message.client.pg.query(`DELETE FROM playlists WHERE user_id = '${message.author.id}' AND name = '${playlistName}'`).catch(console.error);
				if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);

				message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist supprimée**`).catch(console.error);
				break;
			}
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;