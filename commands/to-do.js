const { Message } = require("discord.js");

const command = {
	name: "to-do",
	description: "Liste des commandes/fix à faire pour le bot",
	aliases: ["toDo", "td"],
	args: 0,
	usage: "[add/remove <tâche>]",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const { "rows": toDo } = await message.client.pg.query("SELECT * FROM to_do").catch(console.error);
		if (!toDo) return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);

		switch ((args[0] || "").toLowerCase()) {
			case "add":
				const name = args.slice(1).join(" ");
				const query = `INSERT INTO to_do (name) VALUES ('${name.replace(/'/g, "U+0027")}')`;
				try { await message.client.pg.query(query); }
				catch (err) {
					console.log(err);
					return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
				}
				message.react("✅").catch(console.error);
				break;
			case "remove":
				const index = parseInt(args[1], 10);
				if (isNaN(index) || index < 1 ) {
					return message.reply("le deuxième argument doit être un nombre positif").catch(console.error);
				}
				try { await message.client.pg.query(`DELETE FROM to_do WHERE id=${index}`); }
				catch (err) {
					console.log(err);
					return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
				}
				message.react("✅").catch(console.error);
				break;
			default:
				message.channel.send({
					embed: {
						author: {
							name: "To-do list de ✨Mayze✨",
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: "#010101",
						fields: toDo.map(t => { return { name: `\`${t.id}.\` ${t.name.replace(/U\+0027/g, "'")}`, value: `*${t.created_at.toUTCString()}*`, inline: true } }),
						footer: {
							text: "✨Mayze✨"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = command;