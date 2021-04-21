const { Message } = require("discord.js");

const command = {
	name: "until",
	description: "Obtenir le temps restant avant une date",
	aliases: [],
	args: 1,
	usage: "<date>",
	slashOptions: [
		{
			name: "date",
			description: "Une date future",
			type: 3,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const timeToString = require("../utils/timeToString");
		
		const now = Date.now();
		const date = args
			? Date.parse(args.join(" "))
			: Date.parse(options[0].value);
		if (isNaN(date)) return message.reply(language.invalid_date).catch(console.error);

		const timeLeft = (date - now) / 1000;
		if (timeLeft < 0) return message.reply(language.not_passed).catch(console.error);
		const timeLeftString = timeToString(timeLeft, languageCode);

		const [ month, day, year] = args
			? args[0].split(/\/|-/)
			: options[0].value.split(" ")[0].split(/\/|-/);
		if (!day || !month || !year) return message.reply(language.invalid_date).catch(console.error);
		const dateTime = args
			? args[1]
			: options[0].value.split(" ")[1];
		const monthList = language.months;
		const dateString = language.get(language.date_string, monthList[month - 1], day, year, dateTime || language.midnight, day.endsWith("1"), day.endsWith("2"), day.endsWith("3"), !day.endsWith("1") && !day.endsWith("2") && !day.endsWith("3"));

		message.channel.send(language.get(language.response, timeLeftString, dateString)).catch(console.error);
	}
};

module.exports = command;