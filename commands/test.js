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
		const Utils = require("../utils/music/Util");

		Utils.getVideoFromPlaylist("https://www.deezer.com/fr/playlist/8349642602");



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