const command = {
	name: "since",
	description: "Donne le temps écoulé depuis une date",
	aliases: [],
	args: 1,
	usage: "<date>",
	async execute(message, args) {
		const timeToString = require("../modules/timeToString.js");
		//const UTCOffset = 2;
		const now = Date.now();
		const date = Date.parse(args.join(" ") + " GMT+0100");
		if (isNaN(date)) {
			return message.reply("le format de la date est incorrect (mm/dd/yyyy)").catch(console.error);
		}

		const timePassed = (now - date) / 1000;
		if (timePassed < 0) {
			return message.reply("la date doit déjà être dépassée").catch(console.error);
		}
		const timePassedString = timeToString(timePassed);

		const parts = args[0].split("/");
		if (parts.length !== 3) {
			return message.reply("le format de la date est incorrect (mm/dd/yyy)").catch(console.error);
		}
		const monthList = [
			"janvier",
			"février",
			"mars",
			"avril",
			"mai",
			"juin",
			"juillet",
			"août",
			"septembre",
			"octobre",
			"novembre",
			"décembre"
		];
		const dateString = parts[1] + " " + monthList[parts[0] - 1] + " " + parts[2] + " à "+ (args[1] || "minuit");

		message.channel.send(`Il s'est écoulé ${timePassedString} depuis le **${dateString}**`).catch(console.error);
	}
};

module.exports = command;