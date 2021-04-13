const { Message } = require("discord.js");

const command = {
	name: "now-playing",
	description: {
		fr: "Obtenir la musique actuelle",
		en: "Get the current song"
	},
	aliases: ["np"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Util = require("../utils/music/Util");

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		const queue = message.client.player.getQueue(message.guild.id);
		
		const song = message.client.player.nowPlaying(message.guild.id);
		const msg = await message.channel.send({
			embed: {
				author: {
					name: language.now_playing,
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: song.thumbnail
				},
				color: message.guild.me.displayColor,
				description: language.get(language.description, song.name, song.url, message.client.player.createProgressBar(message.guild.id), song.requestedBy.tag, queue.repeatMode ? song.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatQueue ? queue.songs[0].name : "Ø")), Util.MillisecondsToTime(queue.duration)),
				footer: {
					text: language.get(language.footer, queue.repeatMode, queue.repeatQueue)
				}
			}
		}).catch(console.error);

		let previousTimer = message.client.player.npTimers[message.channel.id];
		if (previousTimer) clearInterval(previousTimer);
		const timer = setInterval(updateMsg, 10000);
		message.client.player.npTimers[message.channel.id] = timer;

		queue.on("end", lastSong => {
			if (timer !== message.client.player.npTimers[message.channel.id]) return;
			clearInterval(timer);
			msg.edit({
				embed: {
					author: {
						name: language.now_playing,
						icon_url: message.client.user.avatarURL()
					},
					thumbnail: {
						url: lastSong.thumbnail,
						height: 720,
						width: 1280
					},
					color: message.guild.me.displayColor,
					description: language.get(language.description, lastSong.name, lastSong.url, Util.buildBar(Util.TimeToMilliseconds(lastSong.duration), Util.TimeToMilliseconds(lastSong.duration), 20, "━", "🔘"), lastSong.requestedBy.tag, "Ø", "**0:00**"),
					footer: {
						text: language.footer_end
					}
				}
			})
		});
		queue.on("stop", () => clearInterval(timer));
		queue.on("channelEmpty", () => clearInterval(timer));
		queue.on("songChanged", (oldSong, newSong) => {
			if (timer === message.client.player.npTimers[message.channel.id]) updateMsg(newSong);
		});

		async function updateMsg(song) {
			const newSong = song || (await message.client.player.nowPlaying(message.guild.id));

			msg.edit({
				embed: {
					author: {
						name: language.now_playing,
						icon_url: message.client.user.avatarURL()
					},
					thumbnail: {
						url: newSong.thumbnail,
						height: 720,
						width: 1280
					},
					color: message.guild.me.displayColor,
					description: language.get(language.description, newSong.name, newSong.url, message.client.player.createProgressBar(message.guild.id, !!song), newSong.requestedBy.tag, queue.repeatMode ? newSong.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatQueue ? queue.songs[0].name : "Ø")), Util.MillisecondsToTime(queue.duration)),
					footer: {
						text: language.get(language.footer, queue.repeatMode, queue.repeatQueue)
					}
				}
			}).catch(err => {
				console.error(err);
				clearInterval(timer);
			});
		}
	}
};

module.exports = command;