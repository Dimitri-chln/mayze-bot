const { Message } = require("discord.js");

const command = {
	name: "since",
	description: {
		fr: "Obtenir le temps écoulé depuis une date",
		en: "See how much time passed since a date"
	},
	aliases: [],
	args: 1,
	usage: "<date>",
	category: "utility",
	newbiesAllowed: true,
	options: [
		{
			name: "date",
			description: "A date which is already passed",
			type: 3,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const timeToString = require("../utils/timeToString");
		
		const now = Date.now();
		const date = args
			? Date.parse(args.join(" "))
			: Date.parse(options[0].value);
		if (isNaN(date)) return message.reply(language.invalid_date).catch(console.error);

		const timePassed = (now - date) / 1000;
		if (timePassed < 0) return message.reply(language.already_passed).catch(console.error);
		const timePassedString = timeToString(timePassed, languageCode);

		const [ month, day, year ] = args
			? args[0].split(/\/|-/)
			: options[0].value.split(" ")[0].split(/\/|-/);
		if (!day || !month || !year) return message.reply(language.invalid_date).catch(console.error);
		const dateTime = args
			? args[1]
			: options[0].value.split(" ")[1];
		const monthList = language.months;
		const dateString = language.get(language.date_string, monthList[month - 1], day, year, dateTime || language.midnight, day.endsWith("1"), day.endsWith("2"), day.endsWith("3"), !day.endsWith("1") && !day.endsWith("2") && !day.endsWith("3"));

		message.channel.send(language.get(language.response, timePassedString, dateString)).catch(console.error);
	}
};

module.exports = command;