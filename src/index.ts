import Dotenv from "dotenv";
Dotenv.config();

import Util from "./Util";

import Fs from "fs";
import Path from "path";
import Discord from "discord.js";

import connectDatabase from "./utils/misc/connectDatabase";

import Translations from "./types/structures/Translations";
import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Event from "./types/structures/Event";

import SpotifyWebApi from "spotify-web-api-node";
import MusicPlayer from "./utils/music/MusicPlayer";
import MusicUtil from "./utils/music/MusicUtil";

const intents = new Discord.Intents([
	Discord.Intents.FLAGS.DIRECT_MESSAGES,
	Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Discord.Intents.FLAGS.GUILD_MEMBERS,
	Discord.Intents.FLAGS.GUILD_MESSAGES,
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.GUILD_PRESENCES,
	Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	Discord.Intents.FLAGS.GUILD_WEBHOOKS,
]);

const client = new Discord.Client({
	intents,
	presence: {
		activities: [
			{
				type: "WATCHING",
				name: "le meilleur clan",
			},
		],
	},
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// Database
connectDatabase();

// Commands
const commandDirectories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
	withFileTypes: true,
})
	.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
	.map((dirent) => dirent.name);

for (const directory of commandDirectories) {
	const commandFiles = Fs.readdirSync(
		Path.resolve(__dirname, "commands", directory),
	).filter((file) => file.endsWith(".js") && file !== "__base.js");

	commandFiles.forEach(async (file) => {
		const path = Path.resolve(__dirname, "commands", directory, file);
		const command: Command = require(path).default ?? require(path);

		command.category = directory;
		command.path = path;
		command.cooldowns = new Discord.Collection();
		command.available = new Promise((resolve, reject) => {
			new Translations(`cmd_${command.name}`)
				.init()
				.then((translations) => {
					command.translations = translations;
					resolve(true);
				})
				.catch((err) => {
					console.error(err);
					resolve(false);
				});
		});

		Util.commands.set(command.name, command);
	});
}

// Message responses
const messageResponseFiles = Fs.readdirSync(
	Path.resolve(__dirname, "message-responses"),
).filter((file) => file.endsWith(".js") && file !== "__base.js");

messageResponseFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "message-responses", file);
	const messageResponse: MessageResponse =
		require(path).default ?? require(path);

	messageResponse.translations = await new Translations(
		`resp_${messageResponse.name}`,
	).init();

	Util.messageResponses.push(messageResponse);
});

// Reaction commands
const reactionCommandsFiles = Fs.readdirSync(
	Path.resolve(__dirname, "reaction-commands"),
).filter((file) => file.endsWith(".js") && file !== "__base.js");

reactionCommandsFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "reaction-commands", file);
	const reactionCommand: ReactionCommand =
		require(path).default ?? require(path);

	reactionCommand.translations = await new Translations(
		`reac_${reactionCommand.name}`,
	).init();

	Util.reactionCommands.push(reactionCommand);
});

// Events
const eventFiles = Fs.readdirSync(Path.resolve(__dirname, "events")).filter(
	(file) => file.endsWith(".js") && file !== "__base.js",
);

eventFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "events", file);
	const event: Event = require(path).default ?? require(path);

	if (event.once) {
		client.once(event.name, (...args) =>
			event.run(...args).catch(console.error),
		);
	} else {
		client.on(event.name, (...args) => event.run(...args).catch(console.error));
	}
});

// Music module
Util.musicPlayer = new MusicPlayer(client);

// Spotify API
const spotify = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

Util.spotify = spotify;

(function getSpotifyToken() {
	spotify.clientCredentialsGrant().then((data) => {
		spotify.setAccessToken(data.body.access_token);
		// Refresh the token 60s before the current one expires
		setTimeout(getSpotifyToken, (data.body.expires_in - 60) * 1000);
	});
})();

// Util.musicPlayer
// 	.on("clientDisconnect", (message, queue) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_disconnect(queue.connection.channel.toString())).catch(console.error);
// 	})

// 	.on("error", (error, message) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		console.error(error);
// 		message.channel.send(translations.strings.music_player_error(error.toString())).catch(console.error);
// 	})

// 	.on("playlistAdd", (message, queue, playlist) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_add_playlist(playlist.videoCount.toString())).catch(console.error);
// 	})

// 	.on("queueEnd", (message, queue) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		const songDisplays = Util.songDisplays.filter(songDisplay => songDisplay.guild.id === message.guild.id);
// 		const lastSong = queue.songs[0];

// 		if (!lastSong) return;

// 		songDisplays.forEach(songDisplay => {
// 			songDisplay.edit({
// 				embeds: [
// 					songDisplay.embeds[0]
// 						.setDescription(translations.strings.song_display_description(
// 							lastSong.name.toString(),
// 							lastSong.url.toString(),
// 							MusicUtil.buildBar(MusicUtil.timeToMilliseconds(lastSong.duration),
// 							MusicUtil.timeToMilliseconds(lastSong.duration), 20, "━", "🔘"),
// 							lastSong.requestedBy as string,
// 							"Ø",
// 							"**0:00**"
// 						))
// 						.setFooter(translations.strings.song_display_footer_end(language))
// 				]
// 			}).catch(console.error);
// 		});
// 	})

// 	.on("songAdd", (message, queue, song) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_add_song(
// 			(getQueueDuration(queue) ? MusicUtil.millisecondsToTime(MusicUtil.timeToMilliseconds(getQueueDuration(queue)) - MusicUtil.timeToMilliseconds(song.duration)) : 0).toString(),
// 			song.name
// 		)).catch(console.error);
// 	})

// 	.on("songChanged", (message, newSong, OldSong) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		const songDisplays = Util.songDisplays.filter(songDisplay => songDisplay.guild.id === message.guild.id);

// 		songDisplays.forEach(songDisplay => {
// 			songDisplay.edit({
// 				embeds: [
// 					songDisplay.embeds[0]
// 						.setDescription(translations.strings.song_display_description(
// 							newSong.name.toString(),
// 							newSong.url.toString(),
// 							MusicUtil.buildBar(0, MusicUtil.timeToMilliseconds(newSong.duration), 20, "━", "🔘"),
// 							newSong.requestedBy as string,
// 							newSong.queue.repeatMode
// 								? newSong.name.toString()
// 								: (newSong.queue.songs[1]
// 									? newSong.queue.songs[1].name.toString()
// 									: (newSong.queue.repeatQueue ? newSong.queue.songs[0].name.toString() : "Ø")),
// 							newSong.queue.repeatMode || newSong.queue.repeatQueue ? "♾️" : getQueueDuration(newSong.queue).toString()
// 						))
// 						.setFooter(translations.strings.song_display_footer(language,
// 							Boolean(newSong.queue.repeatMode),
// 							Boolean(newSong.queue.repeatQueue)
// 						))
// 				]
// 			}).catch(console.error);
// 		});
// 	})

// 	.on("songFirst", (message, song) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_playing(song.name.toString())).catch(console.error);
// 	})

// setInterval(() => {
// 	Util.songDisplays.forEach(songDisplay => {
// 		const language = Util.languages.get(songDisplay.guild.id);
// 		const translations = new Translations(__filename, language);

// 		if (!player.isPlaying(songDisplay)) return Util.songDisplays.delete(songDisplay.channel.id);

// 		const song = player.nowPlaying(songDisplay);

// 		songDisplay.edit({
// 			embeds: [
// 				songDisplay.embeds[0]
// 					.setDescription(translations.strings.song_display_description(
// 						song.name.toString(),
// 						song.url.toString(),
// 						Util.player.createProgressBar(songDisplay, { size: 20, arrow: "🔘", block: "━" }).toString(),
// 						song.requestedBy as string,
// 						song.queue.repeatMode
// 							? song.name.toString()
// 							: (song.queue.songs[1]
// 								? song.queue.songs[1].name.toString()
// 								: (song.queue.repeatQueue ? song.queue.songs[0].name.toString() : "Ø")),
// 						song.queue.repeatMode || song.queue.repeatQueue ? "♾️" : getQueueDuration(song.queue).toString()
// 					))
// 					.setFooter(translations.strings.song_display_footer(language,
// 						Boolean(song.queue.repeatMode),
// 						Boolean(song.queue.repeatQueue)
// 					))
// 			]
// 		}).catch(console.error);
// 	});
// }, 10_000);

client.login(process.env.TOKEN);
