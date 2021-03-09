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
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { CronJob } = require("cron");
		const date = args
			? new Date((args.join(" ").match(/\d{1,2}\/|-\d{1,2}\/|-\d{4}( \d{1,2}(:\d{1,2}(:\d{1,2})?)?)?( GMT(\+|-)\d{1,2})?/) || [])[0])
			: new Date(options[0].value);
		if (!date) return message.reply(language.invalid_date).catch(console.error);
		const taskString = args
			? args.join(" ").replace(/\d{1,2}(\/|-)\d{1,2}(\/|-)\d{4}( \d{1,2}(:\d{1,2}(:\d{1,2})?)?)? /, "")
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