const command = {
	name: "rank",
	description: "Rejoins ou quitte un rank",
	aliases: [],
	args: 1,
	usage: "<rank>",
	async execute(message, args) {
		if (message.member.roles.cache.some(r => r.id === "695943648235487263")) return;
	
		const roleTop = message.guild.roles.cache.get("735810286719598634");
		const roleBottom = message.guild.roles.cache.get("735810462872109156");
		const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position && !r.name.includes("(Jailed)"));
		const rankIdOrName = args.join(" ").toLowerCase();
		const rank = message.guild.roles.cache.get(rankIdOrName) ||
			ranks.find(r => r.name.toLowerCase() === rankIdOrName) ||
			ranks.find(r => r.name.toLowerCase().includes(rankIdOrName));

		if (!ranks.array().includes(rank)) {
			return message.reply("ce rank n'existe pas").catch(console.error);
		}

		if (!message.member.roles.cache.has(rank.id)) {
			try {
				await message.member.roles.add(rank);
				message.channel.send(`${message.author} a rejoint le rank \`${rank.name}\``);
			} catch (err) {
				console.log(err);
				try{ message.channel.send("Quelque chose s'est mal passé en te donnant le rôle :/"); }
				catch (err) { console.log(err); }
			}
		}
		if (message.member.roles.cache.has(rank.id)) {
			try {
				await message.member.roles.remove(rank);
				message.channel.send(`${message.author} a quitté le rank \`${rank.name}\``);
			} catch (err) {
				console.log(err);
				try{ message.channel.send("Quelque chose s'est mal passé en te retirant le rôle :/"); }
				catch (err) { console.log(err); }
			}
		}
	}
};

module.exports = command;