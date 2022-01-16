const { Message } = require("discord.js");

const command = {
	name: "to-do",
	description: "Liste des commandes/fix à faire pour le bot",
	aliases: ["toDo", "td"],
	args: 0,
	usage: "[add <tâche> | remove <tâche>]",
	botPerms: ["EMBED_LINKS"],
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	run: async (message, args, options, language, languageCode) => {
		const { "rows": toDo } = (await message.client.database.query("SELECT * FROM to_do ORDER BY id").catch(console.error)) || {};
		if (!toDo) return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		const subCommand = args
			? (args[0] || "").toLowerCase()
			: (options[0] || { value: "" }).value.toLowerCase();
		const task = args
			? args.slice(1).join(" ")
			: (options[1] || {}).value;

		switch (subCommand) {
			case "add":
				const query = `INSERT INTO to_do (name) VALUES ('${task.replace(/'/g, "''")}')`;
				{
					const res = await message.client.database.query(query).catch(console.error);
					if (!res) return message.reply("responsesQuelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
					if (message.deletable) message.react("✅").catch(console.error);
					else message.reply("tâche ajoutée").catch(console.error);
				}
				break;
			case "remove":
				const index = parseInt(task);
				if (isNaN(index) || index < 1 ) return message.reply("le deuxième argument doit être un nombre positif").catch(console.error);
				{
					const res = await message.client.database.query(`DELETE FROM to_do WHERE id=${index}`).catch(console.error);
					if (!res) return message.reply("responsesQuelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
		if (message.deletable) message.react("✅").catch(console.error);
		else message.reply("tâche retirée").catch(console.error);
				}
				break;
			default:
				message.channel.send({
					embed: {
						author: {
							name: "To-do list de ✨ Mayze ✨",
							iconURL: message.author.displayAvatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						fields: toDo.map(t => {
							return { name: `\`${t.id}.\` ${t.name}`, value: `*${t.created_at.toUTCString()}*`, inline: true }
						}),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = command;