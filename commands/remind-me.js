const { Message } = require("discord.js");

const command = {
	name: "remind-me",
	description: {
		fr: "Gérer tes rappels",
		en: "Manage your reminders"
	},
	aliases: ["remindme", "rmd", "reminder"],
	args: 0,
	usage: "<duration> <reminder> | remove <#reminder>",
	slashOptions: [
		{
			name: "list",
			description: "Get the list of your reminders",
			type: 1
		},
		{
			name: "create",
			description: "Create a reminder",
			type: 1,
			options: [
				{
					name: "duration",
					description: "The time before the reminder triggers",
					type: 3
				},
				{
					name: "reminder",
					description: "The content of the reminder",
					type: 3
				}
			]
		},
		{
			name: "remove",
			description: "Remove a reminder",
			type: 1,
			options: [
				{
					name: "reminder",
					description: "The number of the reminder",
					type: 4
				}
			]
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const dhms = require("dhms");
		const timeToString = require("../utils/timeToString");

		const subCommand = args
			? args.length ? (args[0].toLowerCase() === "remove" ? "remove" : "create") : "list"
			: options[0].name;
		
		const { "rows": reminders } = (await message.client.pg.query(`SELECT * FROM reminders WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		
		switch (subCommand) {
			case "create": {
				const duration = args
					? dhms(args[0])
					: dhms(options[0].options[0].value);
				if (!duration) return message.reply(language.invalid_duration).catch(console.error);
				const timestamp = new Date(Date.now() + duration).toISOString();
				let content = args
					? args.slice(1).join(" ") || "👀"
					: options[0].options[1].value || "👀";
				if (!/^https?:\/\//.test(content)) content = content.replace(/^./, a => a.toUpperCase());

				const res = await message.client.pg.query(`INSERT INTO reminders (user_id, timestamp, content) VALUES ('${message.author.id}', '${timestamp}', '${content.replace(/'/g, "''")}')`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);

				message.reply(language.get(language.created, timeToString(duration / 1000, languageCode), content)).catch(console.error);
				break;
			}
			case "remove": {
				const index = args
					? parseInt(args[1])
					: options[0].options[0].value;
				if (isNaN(index) || index < 1 || index > reminders.length) return message.reply(language.get(language.invalid_number, reminders.length)).catch(console.error);

				const res = await message.client.pg.query(`DELETE FROM reminders WHERE id = ${reminders[index - 1].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply(language.removed).catch(console.error);
				break;
			}
			case "list":
				message.channel.send({
					embed: {
						author: {
							name: language.get(language.title, message.author.tag),
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						description: reminders.length ? null : language.no_reminder,
						fields: reminders.map((reminder, i) => {
							return { name: `\`${i + 1}.\` ${reminder.content}`, value: `*${reminder.timestamp}*`, inline: true };
						}),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			default:
				return message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;