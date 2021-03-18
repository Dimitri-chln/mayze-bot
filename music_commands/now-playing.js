const { Message } = require("discord.js");

const command = {
	name: "now-playing",
	description: "Obtenir la musique actuelle",
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
					name: "Musique en cours",
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: song.thumbnail
				},
				color: message.guild.me.displayHexColor,
				description: `[${song.name}](${song.url})\n\n**${message.client.player.createProgressBar(message.guild.id)}**\n\n\`Ajouté par:\` **${song.requestedBy.tag}**\n\`Suivant:\` **${queue.repeatMode ? song.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatQueue ? queue.songs[0].name : "Rien"))}**\n\`Durée de la queue:\` **${Util.MillisecondsToTime(queue.duration)}**`,
				footer: {
					text: "✨ Mayze ✨" + (queue.repeatMode? " | Répétition de la musique activée" : "") + (queue.repeatQueue ? " | Répétition de la queue activée" : "")
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
						name: "Musique en cours",
						icon_url: message.client.user.avatarURL()
					},
					thumbnail: {
						url: lastSong.thumbnail,
						height: 720,
						width: 1280
					},
					color: message.guild.me.displayHexColor,
					description: `[${lastSong.name}](${lastSong.url})\n\n**${Util.buildBar(Util.TimeToMilliseconds(lastSong.duration), Util.TimeToMilliseconds(lastSong.duration), 20, "━", "🔘")}**\n\n\`Ajouté par:\` **${lastSong.requestedBy.tag}**\n\`Suivant:\` **Rien**\n\`Durée de la queue:\` **0:00**`,
					footer: {
						text: "✨ Mayze ✨ | Queue terminée"
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
						name: "Musique en cours",
						icon_url: message.client.user.avatarURL()
					},
					thumbnail: {
						url: newSong.thumbnail,
						height: 720,
						width: 1280
					},
					color: message.guild.me.displayHexColor,
					description: `[${newSong.name}](${newSong.url})\n\n**${message.client.player.createProgressBar(message.guild.id, !!song)}**\n\n\`Ajouté par:\` **${newSong.requestedBy.tag}**\n\`Suivant:\` **${queue.repeatMode ? newSong.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatQueue ? queue.songs[0].name : "Rien"))}**\n\`Durée de la queue:\` **${Util.MillisecondsToTime(queue.duration)}**`,
					footer: {
						text: "✨ Mayze ✨" + (queue.repeatMode ? " | Répétition de la musique activée" : "") + (queue.repeatQueue ? " | Répétition de la queue activée" : "")
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