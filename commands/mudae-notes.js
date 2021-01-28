const { Message } = require("discord.js");

const command = {
	name: "mudae-notes",
	description: "Obtenir et gérer tes notes mudae",
	aliases: ["notes"],
	args: 0,
	usage: "get | add <note> | remove <n° note>",
	slashOptions: [
		{
			name: "get",
			description: "Obtenir la liste de tes notes mudae",
			type: 1
		},
		{
			name: "add",
			description: "Ajouter une nouvelle note mudae",
			type: 1,
			options: [
				{
					name: "note",
					description: "La nouvelle note",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Retirer une note mudae",
			type: 1,
			options: [
				{
					name: "note",
					description: "Le numéro de la note à retirer",
					type: 4,
					required: true
				}
			]
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
		const note = args
			? args.slice(1).join(" ")
			: options[0].options ? options[0].options[0].value : null;
		const { "rows": notes } = await message.client.pg.query(`SELECT * FROM mudae_notes WHERE user_id = '${message.author.id}'`).catch(console.error);
		if (!notes) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
		
		switch(subCommand) {
			case "add": {
				const res = await message.client.pg.query(`INSERT INTO mudae_notes (user_id, note) VALUES ('${message.author.id}', '${note}')`).catch(console.error);
				if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply("note ajoutée").catch(console.error);
				break;
			}
			case "remove": {
				const noteToRemove = notes[parseInt(note) - 1];
				if (!noteToRemove) return message.reply("cette note n'existe pas").catch(console.error);
				const res = await message.client.pg.query(`DELETE FROM mudae_notes WHERE user_id = '${message.author.id}' AND note = '${noteToRemove.note}'`).catch(console.error);
				if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply("note retirée").catch(console.error);
				break;
			}
			case "get":
				const msg = await message.channel.send({
					embed: {
						author: {
							name: `Notes de ${message.author.tag}`,
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: "#010101",
						description: notes.map((n, i) => `\`${i+1}.\` ${n.note}`).join("\n") || "*Aucune note*",
						footer: {
							text: "✨Mayze✨"
						}
					}
				}).catch(console.error);
				msg.react("📝").catch(console.error);
				const filter = (reaction, user) => reaction.emoji.name === "📝" && user.id === message.author.id;
				const collected = await msg.awaitReactions(filter, { max: 1, time: 30000 }).catch(console.error);
				if (!collected || !collected.size) return;

				const notesToSend = notes;
				let [ currentMsg, currentNote ] = await sendMsg();
				const msgFilter = m => m.author.id === message.author.id && (m.content === currentNote.note || m.content === `${message.client.prefix}stop`);
				const messageCollector = message.channel.createMessageCollector(msgFilter, { time: 120000 });
				messageCollector.on("collect", async m => {
					if (m.content === `${message.client.prefix}stop`) {
						m.react("✅").catch(console.error);
						messageCollector.stop();
						return;
					}
					[ currentMsg, currentNote ] = await sendMsg(currentMsg);
					if (!notesToSend.length) {
						messageCollector.stop();
						return;
					}
				});
				
				async function sendMsg(msgToDelete) {
					if (msgToDelete) msgToDelete.delete().catch(console.error);
					const n = notesToSend.shift();
					const m = await message.channel.send({
						embed: {
							author: {
								name: message.author.tag,
								icon_url: message.author.avatarURL({ dynamic: true })
							},
							color: "#010101",
							description: `\`\`\`\n${n.note.replace(/<a?(:.+:)\d{18}>/, "$1")}\n\`\`\``,
							footer: {
								text: "✨Mayze✨"
							}
						}
					}).catch(console.error);
					return [ m, n ];
				}
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;