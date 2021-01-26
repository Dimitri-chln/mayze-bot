const { Message } = require("discord.js");

const command = {
	name: "since",
	description: "Obtenir le temps écoulé depuis une date",
	aliases: [],
	args: 1,
	usage: "<date>",
	slashOptions: [
		{
			name: "date",
			description: "Une date passée",
			type: 3,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const timeToString = require("../util/timeToString.js");
		
		const now = Date.now();
		const date = args
			? Date.parse(`${args.join(" ")} GMT+0100`)
			: Date.parse(`${options[0].value} GMT+0100`);
		if (isNaN(date)) return message.reply("le format de la date est incorrect (mm-dd-yyyy hh:mm:ss)").catch(console.error);

		const timePassed = (now - date) / 1000;
		if (timePassed < 0) return message.reply("la date doit déjà être dépassée").catch(console.error);
		const timePassedString = timeToString(timePassed);

		const [ month, day, year] = args
			? args[0].split(/\/|-/)
			: options[0].value.split(" ")[0].split(/\/|-/);
		if (!day || !month || !year) return message.reply("le format de la date est incorrect (mm-dd-yyyy hh:mm:ss)").catch(console.error);
		const dateTime = args
			? args[1]
			: options[0].value.split(" ")[1];
		const monthList = [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ];
		const dateString = `${day} ${monthList[month - 1]} ${year} à ${dateTime || "minuit"}`;

		message.channel.send(`Il s'est écoulé ${timePassedString} depuis le **${dateString}**`).catch(console.error);
	}
};

module.exports = command;