const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		function get(text, ...args) {
			text = text
				.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1]);

			while (/\[\d+?\?[^\[\]]*?:.*?\]/gs.test(text)) {
				text = text
					.replace(/\[\d+?\?[^\[\]]*?:.*?\]/gs, a => {
						let m = a.match(/\[(\d+?)\?([^\[\]]*?):(.*?)\]/s);
						if (args[parseInt(m[1]) - 1]) return m[2];
						else return m[3];
					});
			}

			text = text
				.replace(/~c/g, "{")
				.replace(/~b/g, "}")
				.replace(/~s/g, "[")
				.replace(/~t/g, "]")
				.replace(/~d/g, ":")
				.replace(/~q/g, "?");

			return text;
		}

		message.channel.send(get("test [1?oui [2?o:n]:{3}] test", false, true, "ok"));



		// message.client.api.channels[message.channel.id].messages.post({
		// 	data: {
		// 		content: "test",
		// 		components: [
		// 			{
		// 				type: 1,
		// 				components: [
		// 					{
		// 						type: 2,
		// 						label: "Test",
		// 						style: 4,
		// 						emoji: {
		// 							name: "✨"
		// 						},
		// 						custom_id: "test"
		// 					}
		// 				]
		// 			}
		// 		]
		// 	}
		// }).catch(console.error);
	}
};

module.exports = command;