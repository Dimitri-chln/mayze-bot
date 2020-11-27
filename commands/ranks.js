const command = {
	name: "ranks",
	description: "Donne la liste de tous les ranks",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		const roleTop = message.guild.roles.cache.get("735810286719598634");
		const roleBottom = message.guild.roles.cache.get("735810462872109156");
		const ranks = message.guild.roles.cache.filter(r => r.position < roleTop.position && r.position > roleBottom.position && !r.name.includes("(Jailed)"));
		try {
			message.channel.send({
				embed: {
					author: {
					name: "Ranks du serveur 🎗️",
					icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
					},
					color: "#010101",
					description: ranks.map(rank => {
						var hasRank;
						if (message.member.roles.cache.has(rank.id)) hasRank = "✅";
						return `• ${rank} | ${hasRank}`;
					}).join("\n"),
					footer: {
					text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;