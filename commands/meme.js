const { Message } = require("discord.js");
const axios = require("axios");

const command = {
	name: "meme",
	description: "Génère un meme depuis Discord",
	aliases: [],
	args: 0,
	usage: "<image> [texte haut]$[texte bas]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const res = await axios.get("https://api.memegen.link/templates").catch(console.error);
		const memes = res.data.map(meme => meme.key);

		if (args.length) {
			const replacement = {
				"_": "__",
				"-": "--",
				" ": "_",
				"\n": "~n",
				"?": "~q",
				"&": "~a",
				"%": "~p",
				"#": "~h",
				"/": "~s",
				"\\": "~b",
				"\"": "''"
			};

			const image = args[0];
			const top = (args.slice(1).join(" ").split("$")[0] || " ").replace(/[_-\s\n\?&%#\/\\"]/g, a => replacement[a]);
			const bottom = (args.slice(1).join(" ").split("$")[1] || " ").replace(/[_-\s\n\?&%#\/\\"]/g, a => replacement[a]);

			if (!memes.includes(image)) return message.reply(`cette image n'existe pas, tu peux voir la liste de toutes les images avec la commande \`${message.client.prefix}meme\``)

			const url = `https://api.memegen.link/images/${image}/${top}/${bottom}.png`;

			message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					description: `Lien de l'image - [copier](${url})`,
					color: "#010101",
					image: {
						url: url
					},
					footer: {
						text: "✨Mayze✨"
					},
					timestamp: Date.now()
				}
			}).catch(console.error);
		} else {
			message.channel.send({
				embed: {
					title: "Liste de tous les memes disponibles :",
					color: "#010101",
					description: memes.join(", "),
					footer: {
						text: "✨Mayze✨"
					}
				}
			}).catch(console.error);
		}
	}
};

module.exports = command;