const { Message } = require("discord.js");

const command = {
	name: "custom-response",
	description: {
		fr: "Gérer les réponses personnalisées",
		en: "Manage custom responses"
	},
	aliases: ["response", "cr"],
	args: 0,
	usage: "add \"<trigger>\" \"<response>\" [<type>] | remove <#response>",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "add",
			description: "Add a custom response",
			type: 1,
			options: [
				{
					name: "trigger",
					description: "The text that triggers the response",
					type: 3,
					required: true
				},
				{
					name: "response",
					description: "The custom response to be sent",
					type: 3,
					required: true
				},
				{
					name: "type",
					description: "The type of the the trigger",
					type: 4,
					required: false,
					choices: [
						{
							name: "Contains",
							value: 0
						},
						{
							name: "Equal to",
							value: 1
						},
						{
							name: "Regex",
							value: 2
						},
						{
							name: "Starts with",
							value: 3
						},
						{
							name: "Ends with",
							value: 4
						}
					]
				}
			]
		},
		{
			name: "remove",
			description: "Remove a custom response",
			type: 1,
			options: [
				{
					name: "response",
					description: "The number of the response",
					type: 4,
					required: true
				}
			]
		},
		{
			name: "get",
			description: "Get the list of all custom responses",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const subCommand = args
			? (args[0] || "").toLowerCase() || "get"
			: options[0].name;
		
		const { "rows": responses } = (await message.client.pg.query("SELECT * FROM responses").catch(console.error)) || {};
		
		switch (subCommand) {
			case "add": {
				if (args.length < 3) return message.reply(language.not_enough_args).catch(console.error);

				const trigger = args
					? args[1]
					: options[0].options[0].value;
				const response = args
					? args[2]
					: options[0].options[1].value;
				
				const triggerType = args
					? parseInt(args[3]) || 0
					: options[0].options[2] ? options[0].options[2].value : 0;

				const res = await message.client.pg.query(`INSERT INTO responses (trigger, response, trigger_type) VALUES ('${trigger.replace(/"/g, "")}', '${response.replace(/"/g, "")}', ${triggerType})`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply(language.response_added).catch(console.error);
				break;
			}
			case "remove": {
				const n = args
					? parseInt(args[1])
					: options[0].options[0].value;
				if (!n || n < 1 || n > responses.length) return message.reply(language.get(language.invalid_number, responses.length)).catch(console.error);

				const response = responses[n - 1];
				const res = await message.client.pg.query(`DELETE FROM responses WHERE trigger='${response.trigger}' AND response='${response.response}'`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply(language.response_removed).catch(console.error);
				break;
			}
			case "get":
				message.channel.send({
					embed: {
						author: {
							name: language.embed_title,
							icon_url: message.client.user.avatarURL()
						},
						color: message.guild.me.displayHexColor,
						description: responses.map((response, i) => `\`${i + 1}.\` ${language.trigger_types[response.trigger_type]} \`${response.trigger}\`\n\t→ \`${response.response}\``).join("\n"),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;