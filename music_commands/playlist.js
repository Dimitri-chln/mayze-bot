const { Message } = require("discord.js");

const command = {
	name: "playlist",
	description: {
		fr: "Sauvegarder et jouer des playlists",
		en: "Save and play playlists"
	},
	aliases: ["plist", "pl"],
	args: 0,
	usage: "get [-me] | play <name> [-shuffle] | add <name> <url> [-private] | remove <name>",
	slashOptions: [
		{
			name: "get",
			description: "Get the list of all available playlists",
			type: 1,
			options: [
				{
					name: "me",
					description: "Whether to get all or only your playlists",
					type: 5,
					required: false
				}
			]
		},
		{
			name: "play",
			description: "Play a saved playlist",
			type: 1,
			options: [
				{
					name: "name",
					description: "The name of the playlist to play",
					type: 3,
					required: true
				},
				{
					name: "shuffle",
					description: "Whether to shuffle the playlist before playing it",
					type: 5,
					required: false
				}
			]
		},
		{
			name: "add",
			description: "Save a new playlist",
			type: 1,
			options: [
				{
					name: "name",
					description: "The name to give to the playlist",
					type: 3,
					required: true
				},
				{
					name: "url",
					description: "The URL of the playlist",
					type: 3,
					required: true
				},
				{
					name: "private",
					description: "Whether to save this playlist as private or not",
					type: 5,
					required: false
				}
			]
		},
		{
			name: "remove",
			description: "Delete a saved playlist",
			type: 1,
			options: [
				{
					name: "name",
					description: "The name of the playlist",
					type: 3,
					required: true
				}
			]
		}
	],
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
			: options[0].options ? options[0].options[0].value : null;
		
		const { "rows": playlists } = (await message.client.pg.query(`SELECT * FROM playlists WHERE private = false OR user_id = '${message.author.id}'`).catch(console.error)) || {};
		
		switch (subCommand) {
			case "get": {
				const me = args
					? args.includes("-me")
					: optoins[0].options ? options[0].options[0].value : false;
				
				message.channel.send({
					embed: {
						author: {
							name: language.get(language.title, me ? message.author.tag : message.guild.name),
							icon_url: me ? message.author.avatarURL({ dynamic: true }) : message.client.user.avatarURL()
						},
						color: message.guild.me.displayColor,
						description: playlists.filter(p => me ? p.user_id === message.author.id : p).map((playlist, i) => `\`${i + 1}.\` [${playlist.name}](${playlist.url}) - **${(message.guild.members.cache.get(playlist.user_id) || { user: { tag: language.unknown } }).user.tag}**${playlist.private ? " - 🚫" : ""}`).join("\n") || language.no_playlist,
						footer: {
							text: "✨ Mayze ✨" + (playlists.some(p => p.private) ? language.footer_private : "")
						}
					}
				}).catch(console.error);
				break;
			}
			case "play": {
				if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
				const isPlaying = message.client.player.isPlaying(message);

				const shuffle = args
					? args.includes("-shuffle")
					: options[0].options[1] ? options[0].options[1].value : false;
				
				const playlist = playlists.find(p => p.name === playlistName);
				if (!playlist) return message.reply(language.invalid_playlist).catch(console.error);

				if (!message.isInteraction) message.channel.startTyping(1);
				const res = await message.client.player.playlist(message.guild.id, playlist.url, message.member.voice.channel, -1, message.author, shuffle);
				if (!res.playlist) {
					console.error(res.error);
					if (!message.isInteraction) message.channel.stopTyping();
					return message.channel.send(language.error_playlist).catch(console.error);
				}

				message.channel.send(language.get(language.playlist_added, shuffle, res.playlist.videoCount)).catch(console.error);
				if (!isPlaying) message.channel.send(language.get(language.playing, res.song.name)).catch(console.error);
				if (!message.isInteraction) message.channel.stopTyping();
				break;
			}
			case "add": {
				const { rows } = (await message.client.pg.query(`SELECT * FROM playlists WHERE name = '${playlistName}'`).catch(console.error)) || {};
				if (rows.length) return message.reply(language.playlist_already_exists).catch(console.error);

				const url = args
					? args[2]
					: options[0].options[1].value;
				if (!playlistName) return message.reply(language.missing_name).catch(console.error);
				if (!url) return message.reply(language.missing_url).catch(console.error);

				const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
				const spotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;
				if (!playlistRegex.test(url) && !spotifyPlaylistRegex.test(url)) return message.reply(language.invalid_url).catch(console.error);

				const private = args
					? args.includes("-private")
					:  options[0].options[2] ? options[0].options[2].value : false;

				const res = await message.client.pg.query(`INSERT INTO playlists VALUES ('${playlistName}', '${url}', '${message.author.id}', ${private})`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);

				message.channel.send(language.playlist_created).catch(console.error);
				break;
			}
			case "remove": {
				if (!playlistName) return message.reply(language.missing_name).catch(console.error);

				const res = await message.client.pg.query(`DELETE FROM playlists WHERE user_id = '${message.author.id}' AND name = '${playlistName}'`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);

				message.channel.send(language.playlist_deleted).catch(console.error);
				break;
			}
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;