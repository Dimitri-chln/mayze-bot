const command = {
	name: "since",
	description: "Donne le temps écoulé depuis une date",
	aliases: [],
	args: 1,
	usage: "<date>",
	async execute(message, args) {
		const dateToString = require("../modules/dateToString.js");
		//const UTCOffset = 2;
		const now = Date.now();
		const date = Date.parse(args.join(" ") + " GMT+0100");
		if (isNaN(date)) {
			try { message.reply("le format de la date est incorrect (mm/dd/yyyy)"); }
			catch (err) { console.log(err); }
			return;
		}

		const timePassed = (now - date) / 1000;
		if (timePassed < 0) {
			try { message.reply("la date doit déjà être dépassée"); }
			catch (err) { console.log(err); }
			return;
		}
		const timePassedString = dateToString(timePassed);

		const parts = args[0].split("/");
		if (parts.length !== 3) {
			try { message.reply("le format de la date est incorrect (mm/dd/yyy)"); }
			catch (err) { console.log(err); }
			return;
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

		try { message.channel.send(`Il s'est écoulé ${timePassedString} depuis le **${dateString}**`); }
		catch (err) { console.log(err); }
	}
};

module.exports = command;