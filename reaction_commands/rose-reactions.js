const { MessageReaction, User } = require("discord.js");

const command = {
    /**
     * @param {MessageReaction} reaction 
     * @param {User} user 
     * @param {boolean} added
     */
    execute: async (reaction, user, added) => {
        if (reaction.message.channel.id !== "817365433509740554") return;
        if (reaction.emoji.id !== "833620353133707264") return;

        if (added) reaction.message.guild.members.cache.get(user.id).roles.add("833620668066693140").catch(console.error);
        else reaction.message.guild.members.cache.get(user.id).roles.remove("833620668066693140").catch(console.error);
    }
};

module.exports = command;