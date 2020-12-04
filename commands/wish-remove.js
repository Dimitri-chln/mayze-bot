const command = {
	name: "wish-remove",
	description: "Retire le wish d'une série pour Mudae",
	aliases: ["wishRemove", "wr"],
	args: 1,
	usage: "<série>",
	async execute(message, args) {
		const series = args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
		try { await message.client.pg.query(`DELETE FROM wishes WHERE user_id='${message.author.id}' AND series='${series}'`); }
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		message.react("✅").catch(console.error);
	}
};

module.exports = command;