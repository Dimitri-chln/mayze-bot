const command = {
	name: "jail",
	decription: "Met un membre en prison",
	aliases: [],
	cooldown: 5,
	args: 1,
	usage: "<mention>",
	perms: ["MANAGE_ROLES"],
	async execute(message, args) {
		const user = message.mentions.users.first();
		if (!user) {
			try { message.reply("mentionne la personne à mettre en prison"); }
			catch (err) { console.log(err); }
			return;
		}
		const member = message.guild.members.cache.find(m => m.user === user);
		if (member.roles.highest.position >= message.member.roles.highest.position) {
			try { message.reply("tu ne peux pas mettre cette personne en prison"); }
			catch (err) { console.log(err); }
			return;
		};

		const roleTop = message.guild.roles.cache.get("735810286719598634");
		const roleBottom = message.guild.roles.cache.get("735810462872109156");
		const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position);

		if (!member.roles.cache.some(r => r.id === "695943648235487263")) {
		// If not jailed
			try { member.roles.add("695943648235487263"); }
			catch (err) {
				console.log(err);
				try { message.channel.send("le rôle jailed n'existe plus ou je n'ai pas les permissions suffisantes"); }
				catch (err) { console.log(err); }
			}
			const notJailedRanks = ranks.filter(r => !r.name.includes("(Jailed)"));
			notJailedRanks.forEach(rank => {
				const jailedRank = ranks.find(r => r.name === rank.name + " (Jailed)") || {};
				if (member.roles.cache.has(rank.id)) {
					try { member.roles.remove(rank.id); }
					catch (err) { console.log(err); }
					try { member.roles.add(jailedRank.id); }
					catch (err) {
						console.log(err);
						try { message.channel.send(`Je n'ai pas trouvé le rôle correspondant au rank "${rank.name}"`); }
						catch (err) { console.log(err); }
					}
				}
			});

			if (member.roles.cache.has("689180158359371851")) {
				// Administrateur
				try {
					member.roles.remove("689180158359371851");
					member.roles.add("753245162469064795");
				} catch (err) { console.log(err); }
			}
			if (member.roles.cache.has("737646140362850364")) {
				// Modérateur
				try {
					member.roles.remove("737646140362850364");
					member.roles.add("753250476891439185");
				} catch (err) { console.log(err); }
			}
			if (member.roles.cache.has("696751614177837056")) {
				// Sous Chef
				try {
					member.roles.remove("696751614177837056");
					member.roles.add("753251533768097933");
				} catch (err) { console.log(err); }
			}
			if (member.roles.cache.has("689218691560505472")) {
				// 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
				try {
					member.roles.remove("689218691560505472");
					member.roles.add("753253307052589176");
				} catch (err) { console.log(err); }
			}
			try { message.react("🔗"); }
			catch (err) { console.log(err); }
		} else {
		// If jailed
		try { member.roles.remove("695943648235487263"); }
		catch (err) { console.log(err); }
		const jailedRanks = ranks.filter(r => r.name.includes("(Jailed)"));
		jailedRanks.forEach(rank => {
			const notJailedRank = ranks.find(r => r.name + " (Jailed)" === rank.name) || {};
			if (member.roles.cache.has(rank.id)) {
				try { member.roles.remove(rank.id); }
				catch (err) { console.log(err); }
				try { member.roles.add(notJailedRank.id); }
				catch (err) {
					console.log(err);
					try { message.channel.send(`Je n'ai pas trouvé le rôle correspondant au rank "${rank.name}"`); }
					catch (err) { console.log(err); }
				}
			}
		});
		if (member.roles.cache.has("753245162469064795")) {
			// Administrateur
			try {
				member.roles.remove("753245162469064795");
				member.roles.add("689180158359371851");
			} catch (err) { console.log(err); }
		}
		if (member.roles.cache.has("753250476891439185")) {
			// Modérateur
			try {
				member.roles.remove("753250476891439185");
				member.roles.add("737646140362850364");
			} catch (err) { console.log(err); }
		}
		if (member.roles.cache.has("753251533768097933")) {
			// Sous Chef
			try {
				member.roles.remove("753251533768097933");
				member.roles.add("696751614177837056");
			} catch (err) { console.log(err); }
		}
		if (member.roles.cache.has("753253307052589176")) {
			// 👑🐍•🐣✨•🌙🐒•⚡🦅•🦄❄️
			try {
				member.roles.remove("753253307052589176");
				member.roles.add("689218691560505472");
			} catch (err) { console.log(err); }
		}
		try { message.react("👋"); }
		catch (err) { console.log(err); }
		}
	}
};

module.exports = command;