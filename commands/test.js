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
		message.client.spotify.searchTracks("artist:Imagine Dragons track:Follow You", {
			limit: 1
		})
			.then(res => console.log(res));



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