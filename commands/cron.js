const { Message } = require("discord.js");

const command = {
	name: "cron",
	description: "Ajoute une tâche cron",
	aliases: [],
	args: 3,
	usage: "\"<date>\" <fonction>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const { CronJob } = require("cron");
		const [ , date ] = args.join(" ").match(/^"([^"]+)"/);
		const taskInput = args.join(" ").replace(/^"[^"]+" /, "");
		const task = eval(`async () => { ${ taskInput } }`);
		const job = new CronJob(new Date(date), task);
		job.start();
		message.react("✅").catch(console.error);
	}
};

module.exports = command;