const { MessageReaction, User } = require("discord.js");

const command = {
    /**
     * @param {MessageReaction} reaction 
     * @param {User} user 
     * @param {boolean} added 
     */
	async execute(reaction, user, added) {
        const { GIVEAWAY_CHANNEL_ID } = require("../config.json");

		if (!added) return;
		if (reaction.message.channel.id !== GIVEAWAY_CHANNEL_ID) return;
		if (reaction.message.author.id !== reaction.message.client.user.id) return;
		const giveawayEmbed = reaction.message.embeds[0];
		if (!giveawayEmbed) return;
		if (giveawayEmbed.title.startsWith("Giveaway de")) return;

        if (reaction.emoji.name !== "🎉")
            reaction.users.remove(user).catch(console.error);

        const [ , requiredRole ] = message.embeds[0].description.match(/Uniquement pour:` <@&(\d{18})>/) || [];
        if (!requiredRole) return;

        if (!reaction.message.guild.member(user).roles.cache.has(requiredRole))
            reaction.users.remove(user);
	}
};

module.exports = command;