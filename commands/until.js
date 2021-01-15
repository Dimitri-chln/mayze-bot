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
	async execute(message, args, options) {
		const timeToString = require("../modules/timeToString.js");
		
		const now = Date.now();
		const date = args
			? Date.parse(`${args.join(" ")} GMT+0100`)
			: Date.parse(`${options[0].value} GMT+0100`);
		if (isNaN(date)) return message.reply("le format de la date est incorrect (mm-dd-yyyy hh:mm:ss)").catch(console.error);

		const timeLeft = (date - now) / 1000;
		if (timeLeft < 0) return message.reply("la date ne doit pas être dépassée").catch(console.error);
		const timeLeftString = timeToString(timeLeft);

		const [ month, day, year] = args
			? args[0].split(/\/|-/)
			: options[0].value.split(" ")[0].split(/\/|-/);
		if (!day || !month || !year) return message.reply("le format de la date est incorrect (mm-dd-yyyy hh:mm:ss)").catch(console.error);
		const dateTime = args
			? args[1]
			: options[0].value.split(" ")[1];
		const monthList = [ "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ];
		const dateString = `${day} ${monthList[month - 1]} ${year} à ${dateTime || "minuit"}`;

		message.channel.send(`Il reste ${timeLeftString} avant le **${dateString}**`).catch(console.error);
	}
};

module.exports = command;