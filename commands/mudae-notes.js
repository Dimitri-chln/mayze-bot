const { Message } = require("discord.js");

const command = {
	name: "mudae-notes",
	description: {
		fr: "Obtenir et gérer tes notes mudae",
		en: "Get and manage your mudae notes"
	},
	aliases: ["notes"],
	args: 0,
	usage: "get | add <note> | remove <note>",
	slashOptions: [
		{
			name: "get",
			description: "Get the list of your mudae notes",
			type: 1
		},
		{
			name: "add",
			description: "Add a new mudae note",
			type: 1,
			options: [
				{
					name: "note",
					description: "The note to add",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Remove an existing mudae note",
			type: 1,
			options: [
				{
					name: "note",
					description: "The number of the note to remove",
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
	execute: async (message, args, options, language, languageCode) => {
		const subCommand = args
			? (args[0] || "").toLowerCase() || "get"
			: options[0].name;
		const note = args
			? args.slice(1).join(" ")
			: options[0].options ? options[0].options[0].value : null;
		
		const { "rows": notes } = (await message.client.pg.query(`SELECT * FROM mudae_notes WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!notes) return message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);
		
		switch(subCommand) {
			case "add": {
				const res = await message.client.pg.query(`INSERT INTO mudae_notes (user_id, note) VALUES ('${message.author.id}', '${note}')`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);
				if (!message.isInteraction) message.react("✅").catch(console.error);
				else message.reply(language.note_added, { ephemeral: true }).catch(console.error);
				break;
			}
			case "remove": {
				const noteToRemove = notes[parseInt(note) - 1];
				if (!noteToRemove) return message.reply(language.invalid_note).catch(console.error);
				const res = await message.client.pg.query(`DELETE FROM mudae_notes WHERE user_id = '${message.author.id}' AND note = '${noteToRemove.note}'`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);
				if (!message.isInteraction) message.react("✅").catch(console.error);
				else message.reply(language.note_removed, { ephemeral: true }).catch(console.error);
				break;
			}
			case "get":
				const msg = await message.channel.send({
					embed: {
						author: {
							name: language.get(language.title, message.author.tag),
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						description: notes.map((n, i) => `\`${i+1}.\` ${n.note}`).join("\n") || language.no_note,
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				msg.react("📝").catch(console.error);
				const filter = (reaction, user) => reaction.emoji.name === "📝" && user.id === message.author.id;
				const collected = await msg.awaitReactions(filter, { max: 1, time: 30000 }).catch(console.error);
				if (!collected || !collected.size) return;

				const notesToSend = notes;
				let [ currentMsg, currentNote ] = await sendMsg();
				const msgFilter = m => m.author.id === message.author.id && (m.content === currentNote.note || m.content === `${message.client.prefix}cancel`);
				const messageCollector = message.channel.createMessageCollector(msgFilter, { time: 120000 });
				messageCollector.on("collect", async m => {
					if (m.content === `${message.client.prefix}cancel`) {
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
							color: message.guild.me.displayColor,
							description: `\`\`\`\n${n.note.replace(/<a?(:.+:)\d{18}>/, "$1")}\n\`\`\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);
					return [ m, n ];
				}
				break;
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;