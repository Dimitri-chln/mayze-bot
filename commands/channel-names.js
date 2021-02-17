const { Message } = require("discord.js");

const command = {
	name: "channel-names",
	description: {
		fr: "Modifier le nom de tous les salons en une seule commande",
		en: "Edit all channels names in one command"
	},
	aliases: ["cn"],
	args: 2,
	usage: "\"<regex>\" \"<replacement>\" [type]",
	perms: ["ADMINISTRATOR"],
	slashOptions: [
		{
			name: "regex",
			description: "The regex to match in the channels names",
			type: 3,
			required: true
		},
		{
			name: "replacement",
			description: "What to replace the matched text with",
			type: 3,
			required: true
		},
		{
			name: "type",
			description: "the type of the channels to edit (text, voice, category)",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, languages, language) => {
		const userValidation = require("../utils/userValidation");
		const type = args
			? args[2]
			: (options[2] || {}).value;
		const channels = message.guild.channels.cache
			.filter(c => c.type === (type || "text") || c.type === (type || "voice"))
			.sort((a, b) => {
				if (a.type === "text" && b.type === "voice") return -1;
				if (a.type === "voice" && b.type === "text") return 1;
				return a.rawPosition - b.rawPosition;
			});
		const regex = args
			? new RegExp(args[0], "g")
			: new RegExp(options[0].value, "g");
		const replace = args
			? args[1]
			: options[1].value;
		const newChannels = channels.map(c => c.name.replace(regex, replace));
		const msg = await message.channel.send({
			embed: {
				author: {
					name: languages.verification_title[language],
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				thumbnail: {
					url: message.client.user.avatarURL()
				},
				title: languages.verification_desc[language],
				color: "#010101",
				description: newChannels.join("\n"),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
		if (!msg) return message.channel.send(languages.error_msg_too_long[language]).catch(console.error);

		const validation = await userValidation(message.author, msg);
		if (!validation) return message.channel.send(languages.cancelled[language]).catch(console.error);
		const loadingMsg = await message.channel.send(languages.get(languages.editing[language], channels.size)).catch(console.error);
		
		let errors = 0;
		channels.forEach(async c => {
			c.setName(c.name.replace(regex, replace)).catch(err => {
				++errors;
				console.error(err);
			});
		});
		loadingMsg.edit(languages.get(languages.done_editing[language], channels.size - errors, errors));
	}
};

module.exports = command;