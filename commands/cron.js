const { Message } = require("discord.js");

const command = {
	name: "cron",
	description: {
		fr: "Planifier une tâche cron",
		en: "Start a cron task"
	},
	aliases: [],
	args: 2,
	usage: "<date> <function>",
	botPerms: ["ADD_REACTIONS"],
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { CronJob } = require("cron");
		const date = args
			? new Date(args[0])
			: new Date(options[0].value);
		if (!date) return message.reply(language.invalid_date).catch(console.error);
		const taskString = args
			? args.slice(1).join(" ")
			: options[1].value;
		const task = eval(`async () => { ${taskString} }`);
		const job = new CronJob(date, task);
		try {
			job.start();
		} catch (err) {
			console.error(err);
			return message.reply(language.date_passed).catch(console.error);
		}
		if (message.deletable) message.react("✅").catch(console.error);
		else message.channel.send(language.saved).catch(console.error);
	}
};

module.exports = command;