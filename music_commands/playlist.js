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
	botPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
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
		const Axios = require("axios").default;

		const subCommand = args
			? args.length && args[0] !== "-me" ? args[0].toLowerCase() : "get"
			: options[0].name;
		const playlistName = args
			? args[1]
			: options[0].options ? options[0].options[0].value : null;
		
		const { "rows": playlists } = (await message.client.pg.query(`SELECT * FROM playlists WHERE NOT private OR user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!playlists) return message.channel.send(language.errors.database).catch(console.error);
		
		switch (subCommand) {
			case "get": {
				const me = args
					? args.includes("-me")
					: optoins[0].options ? options[0].options[0].value : false;
				
				message.channel.send({
					embed: {
						author: {
							name: language.get(language.title, me ? message.author.tag : message.guild.name),
							icon_url: me ? message.author.displayAvatarURL({ dynamic: true }) : message.client.user.displayAvatarURL()
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
				
				const shuffle = args
					? args.includes("-shuffle")
					: options[0].options[1] ? options[0].options[1].value : false;
				
				const playlistData = playlists.find(p => p.name === playlistName);
				if (!playlistData) return message.reply(language.invalid_playlist).catch(console.error);

				if (!message.isInteraction) message.channel.startTyping(1);

				await message.client.player.playlist(message, {
					search: playlistData.url,
					maxSongs: -1,
					requestedBy: message.author.tag,
					shuffle
				});

				if (!message.isInteraction) message.channel.stopTyping();
				break;
			}
			case "add": {
				const { rows } = (await message.client.pg.query(`SELECT * FROM playlists WHERE name = '${playlistName}'`).catch(console.error)) || {};
				if (!rows) return message.channel.send(language.errors.database).catch(console.error);
				if (rows.length) return message.reply(language.playlist_already_exists).catch(console.error);

				let url = args
					? args[2]
					: options[0].options[1].value;
				if (!playlistName) return message.reply(language.missing_name).catch(console.error);
				if (!url) return message.reply(language.missing_url).catch(console.error);

				const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
				const spotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;
				const DeezerPlaylistRegex = /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?playlist\/(\d+)/;
				const DeezerRegexScrap = /https?:\/\/deezer\.page\.link\/\w+/;

				if (DeezerRegexScrap.test(url)) {
					const res = await Axios.get(search).catch(err => {
						console.error(err);
						url = null;
					});
					let [ , scrap ] = res.data.match(/property="og:url" content="(.*)"/) || [];
					url = scrap;
					
					if (!url) return message.reply(language.error_deezer).catch(console.error);
				}

				if (!playlistRegex.test(url) && !spotifyPlaylistRegex.test(url) && !DeezerPlaylistRegex.test(url)) return message.reply(language.invalid_url).catch(console.error);

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