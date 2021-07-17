const { Message } = require("discord.js");
const Axios = require("axios").default;

const command = {
	name: "meme",
	description: {
		fr: "Générer un meme depuis Discord",
		en: "Meme generation from Discord"
	},
	aliases: [],
	args: 0,
	usage: "[<image>] \"[<line>]\" \"[<line>]\"...",
	botPerms: ["EMBED_LINKS"],
	category: "miscellaneous",
	newbiesAllowed: true,
	slashOptions: [
		{
			name: "image",
			description: "The name of the background image - See *meme",
			type: 3,
			required: false
		},
		{
			name: "text",
			description: "The text to display. Separate lines with //",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.isInteraction) message.channel.startTyping(1);
		const { data } = message.client.memes || await Axios.get("https://api.memegen.link/templates").catch(console.error);
		message.client.memes = { data: data };
		if (!message.isInteraction) message.channel.stopTyping();
		
		const memes = data.map(meme => meme.id);

		const image = args
			? (args[0] || "").toLowerCase()
			: (options ? options.find(o => o.name === "image") : { value: "" }).value.toLowerCase();

		if (image) {
			if (!memes.includes(image)) return message.reply(language.get(language.invalid_image, message.client.prefix));

			const lines = args
				? args.slice(1)
				: (options.find(o => o.name === "text") || { value: "" }).value.split(/ *\/\/ */);

			const url = `https://api.memegen.link/images/${image}/${lines.map(line => replacement(line)).join("/")}.png`;

			message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.displayAvatarURL({ dynamic: true })
					},
					description: language.get(language.copy_link, url),
					color: message.guild.me.displayColor,
					image: {
						url: url
					},
					footer: {
						text: "✨ Mayze ✨"
					},
					timestamp: Date.now()
				}
			}).catch(console.error);

		} else {

			message.channel.send({
				embed: {
					title: language.image_list,
					color: message.guild.me.displayColor,
					description: memes.join(", "),
					footer: {
						text: "✨ Mayze ✨"
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
			return text.replace(/[_-\s\n\?&%#\/\\"]/g, a => characters[a]);
		}
	}
};

module.exports = command;