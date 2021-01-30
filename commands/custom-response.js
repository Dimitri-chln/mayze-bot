const { Message } = require("discord.js");

const command = {
	name: "custom-response",
	description: "Gérer les réponses personnalisées",
	aliases: ["responses", "cr"],
	args: 0,
	usage: "add \"<déclencheur>\" \"<réponse>\" [type] | remove <n° réponse>",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "add",
			description: "Ajouter une réponse personnalisée",
			type: 1,
			options: [
				{
					name: "déclencheur",
					description: "Le texte qui déclenche la réponse",
					type: 3,
					required: true
				},
				{
					name: "réponse",
					description: "La réponse à envoyer",
					type: 3,
					required: true
				},
				{
					name: "type",
					description: "Le type de déclencheur",
					type: 4,
					required: false,
					choices: [
						{
							name: "Correspondance simple",
							value: 0
						},
						{
							name: "Correspondance exacte",
							value: 1
						},
						{
							name: "Regex",
							value: 2
						},
						{
							name: "Commence par",
							value: 3
						},
						{
							name: "Finit par",
							value: 4
						}
					]
				}
			]
		},
		{
			name: "remove",
			description: "Retirer une réponse personnalisée",
			type: 1,
			options: [
				{
					name: "réponse",
					description: "Le numéro de la réponse à retirer",
					type: 4,
					required: true
				}
			]
		},
		{
			name: "get",
			description: "Obtenir la liste des réponses personnalisées",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const subCommand = args
			? (args[0] || "").toLowerCase() || "get"
			: options[0].name;
		
		const { "rows": responses } = await message.client.pg.query("SELECT * FROM responses").catch(console.error);
		
		switch (subCommand) {
			case "add": {
				const [ trigger, response ] = args
					? args.join(" ").match(/"[^"]+"/g) || []
					: [ options[0].options[0].value, options[0].options[1].value ];
				console.log(trigger);
				console.log(response);
				if (!trigger || !response) return message.reply("écris le déclencheur et la réponse entre guillemets").catch(console.error);
				const triggerType = args
					? parseInt(args.pop()) || 0
					: options[0].options[2] ? options[0].options[2].value : 0;

				const res = await message.client.pg.query(`INSERT INTO responses (trigger, response, trigger_type) VALUES ('${trigger.replace(/"/g, "")}', '${response.replace(/"/g, "")}', ${triggerType})`).catch(console.error);
				if (!res) return message.reply("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply("réponse ajoutée").catch(console.error);
				break;
			}
			case "remove": {
				const n = args
					? parseInt(args[1])
					: options[0].options[0].value;
				if (!n || n < 1 || n > responses.length) return message.reply(`le numéro doit être compris entre 1 et ${responses.length}`).catch(console.error);

				const response = responses[n - 1];
				const res = await message.client.pg.query(`DELETE FROM responses WHERE trigger='${response.trigger}' AND response='${response.response}'`).catch(console.error);
				if (!res) return message.reply("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply("réponse retirée").catch(console.error);
				break;
			}
			case "get":
				const triggerTypes = {
					0: "Contient",
					1: "Égal à",
					2: "Correspond à",
					3: "Commence par",
					4: "Finit par"
				};

				message.channel.send({
					embed: {
						author: {
							name: "Réponses personnalisées",
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: responses.map((response, i) => `\`${i + 1}.\` ${triggerTypes[response.trigger_type]} \`${response.trigger}\`\n\t→ \`"${response.response}"\``).join("\n"),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;