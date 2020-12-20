const command = {
	name: "until",
	description: "Donne le temps restant avant une date",
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

		const timeLeft = (date - now) / 1000;
		if (timeLeft < 0) {
			return message.reply("la date ne doit pas être dépassée").catch(console.error);
		}
		const timeLeftString = timeToString(timeLeft);

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

		message.channel.send(`Il reste ${timeLeftString} avant le **${dateString}**`).catch(console.error);
	}
};

module.exports = command;