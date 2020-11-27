const command = {
	name: "to-do",
	description: "Liste des commandes/fix à faire pour le bot",
	aliases: ["toDo", "td"],
	args: 0,
	usage: "[add/remove <tâche>$[extras]]",
	ownerOnly: true,
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		var toDo;
		try {
			const { rows } = await databaseSQL("SELECT * FROM to_do");
			toDo = rows;
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		switch ((args[0] || "").toLowerCase()) {
			case "":
				message.channel.send({
					embed: {
						author: {
							name: "To-do list de ✨Mayze✨",
							icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
						},
						color: "#010101",
						fields: toDo.map(t => { return { name: `\`${t.id}.\` ${t.name}`, value: `*${t.created_at.toUTCString()}*`, inline: true } }),
						footer: {
							text: "✨Mayze✨"
						}
					}
				}).catch(console.error);
				break;
			case "add":
				const name = args.slice(1).join(" ").split("$")[0];
				const extra = args.join(" ").split("$")[1];
				var query = `INSERT INTO to_do (name) VALUES ('${name}')`;
				if (extra) query = `INSERT INTO to_do (name, extra) VALUES ('${name}', '${extra}')`;
				try { await databaseSQL(query); }
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
				try { await databaseSQL(`DELETE FROM to_do WHERE id=${index}`); }
				catch (err) {
					console.log(err);
					return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
				}
				message.react("✅").catch(console.error);
		}
	}
};

module.exports = command;