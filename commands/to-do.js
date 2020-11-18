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
			const { rows } = await databaseSQL("SELECT * FROM to_do WHERE finished_at=null");
			toDo = rows;
		} catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/"); }
			catch (err) { console.log(err); }
			return;
		}
		switch ((args[0] || "").toLowerCase()) {
			case "":
				try {
						message.channel.send({
						embed: {
							author: {
								name: "To-do list pour ✨Mayze✨",
								icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
							},
							color: "#010101",
							fields: toDo.map(t => { return { name: `${t.name} - ${t.created_at}`, value: `*${t.extra || "-"}*`, inline: true } }),
							footer: {
								text: "✨Mayze✨"
							}
						}
					});
				} catch (err) { console.log(err); }
				break;
			case "add":
				const name = args.join(" ").split("$")[0];
				const extra = args.join(" ").split("$")[1];
				try { await databaseSQL(`INSERT INTO to_do (name, extra) VALUES ('${name}', '${extra}')`); }
				catch (err) {
					console.log(err);
					try { message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/"); }
					catch (err) { console.log(err); }
					return;
				}
				try { message.react("✅"); }
				catch (err) { console.log(err); }
				break;
			case "remove":
				const index = parseInt(args[1], 10);
				if (isNaN(index) || index < 1 )
					try { message.reply("le deuxième argument doit être un nombre positif"); }
					catch (err) { console.log(err); }
				try { await databaseSQL(`UPDATE to_do SET finished_at = CURRENT_TIMESTAMP() WHERE id=${index}`); }
				catch (err) {
					console.log(err);
					try { message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/"); }
					catch (err) { console.log(err); }
					return;
				}
				try { message.react("✅"); }
				catch (err) { console.log(err); }
		}
	}
};

module.exports = command;