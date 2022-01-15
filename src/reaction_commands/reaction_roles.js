const { MessageReaction, User } = require("discord.js");

const command = {
    /**
     * @param {MessageReaction} reaction 
     * @param {User} user 
     * @param {boolean} added
     */
    run: async (reaction, user, added) => {
        const { ROLES_CHANNEL_ID } = require("../config.json");
        if (reaction.message.channel.id !== ROLES_CHANNEL_ID) return;
        if (!reaction.message.embeds.length) return;
        const embed = reaction.message.embeds[0];
        const roles = embed.description.split("\n").map(e => {
            return { emoji: e.replace(/ •.*/, ""), role: reaction.message.guild.roles.cache.get(e.match(/\d{18}/)[0]) };
        });

        const role = roles.find(r => r.emoji === reaction.emoji.name);
        if (!role) return;

        if (added) reaction.message.guild.member(user).roles.add(role.role);
        if (!added) reaction.message.guild.member(user).roles.remove(role.role);
    }
};

module.exports = command