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
	execute: async (message, args, options, languages, language) => {
		const { Util } = require("../utils/MusicPlayer");

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
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
				color: "#010101",
				description: `[${song.name}](${song.url})\n\n**${message.client.player.createProgressBar(message.guild.id)}**\n\n\`Ajouté par:\` **${song.requestedBy.tag}**\n\`Suivant:\` **${song.loop ? song.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatMode ? queue.songs[0].name : "Rien"))}**\n\`Durée:\` **${Util.MillisecondsToTime(queue.duration - queue.dispatcher.streamTime)}**`,
				footer: {
					text: "✨ Mayze ✨" + (song.loop ? " | Répétition de la musique activée" : "") + (queue.repeatMode ? " | Répétition de la queue activée" : "")
				}
			}
		}).catch(console.error);

		let previousTimer = message.client.player.npTimers[message.channel.id];
		if (previousTimer) clearInterval(previousTimer);
		const timer = setInterval(updateMsg, 10000);
		message.client.player.npTimers[message.channel.id] = timer;

		queue.on("songChanged", () => setTimeout(updateMsg, 1000));
		queue.on("end", () => clearInterval(timer));
		queue.on("stop", () => clearInterval(timer));
		queue.on("channelEmpty", () => clearInterval(timer));

		async function updateMsg() {
			const newSong = await message.client.player.nowPlaying(message.guild.id);
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
					color: "#010101",
					description: `[${newSong.name}](${newSong.url})\n\n**${message.client.player.createProgressBar(message.guild.id)}**\n\n\`Ajouté par:\` **${newSong.requestedBy.tag}**\n\`Suivant:\` **${song.loop ? song.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatMode ? queue.songs[0].name : "Rien"))}**\n\`Durée:\` **${Util.MillisecondsToTime(queue.duration - queue.dispatcher.streamTime)}**`,
					footer: {
						text: "✨ Mayze ✨"
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