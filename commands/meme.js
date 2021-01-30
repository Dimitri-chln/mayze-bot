const { Message } = require("discord.js");
const Axios = require("axios").default;

const command = {
	name: "meme",
	description: "Générer un meme depuis Discord",
	aliases: [],
	args: 0,
	usage: "[image] \"[texte haut]\" \"[texte bas]\"",
	slashOptions: [
		{
			name: "image",
			description: "Le nom de l'image de fond",
			type: 3,
			required: false
		},
		{
			name: "texte-haut",
			description: "Le texte à afficher en haut de l'image",
			type: 3,
			required: false
		},
		{
			name: "texte-bas",
			description: "Le texte à afficher en bas de l'image",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const { data } = message.client.memes || await Axios.get("https://api.memegen.link/templates").catch(console.error);
		message.client.memes = { data: data };
		const memes = data.map(meme => meme.key);

		const image = args
			? (args[0] || "").toLowerCase()
			: (options ? options.find(o => o.name === "image") : { value: "" } ).value.toLowerCase();

		if (image) {
			if (!memes.includes(image)) return message.reply(`cette image n'existe pas, tu peux voir la liste de toutes les images avec la commande \`${message.client.prefix}meme\``);
			const [ top, bottom ] = args
				? args.join(" ").match(/"([^"])*"/g) || []
				: [ (options.find(o => o.name === "texte-haut") || {}).value, (options.find(o => o.name === "texte-bas") || {}).value ];

			const url = `https://api.memegen.link/images/${image}/${replacement(top || " ")}/${replacement(bottom || " ")}.png`;

			message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					description: `• Copier le [lien](${url})`,
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

		function replacement(text) {
			const characters = {
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
			return text.replace(/(^")|("$)/g, "").replace(/[_-\s\n\?&%#\/\\"]/g, a => characters[a]);
		}
	}
};

module.exports = command;