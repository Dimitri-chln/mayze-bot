module.exports = {
    name: "unmute",
    description: "Unmute une personne sur le serveur",
    aliases: [],
    args: 1,
    usage: "<mention/id>",
    perms: ["MANAGE_ROLES"],
    execute(message, args) {
        const userID = (message.mentions.users.first() || {"id": args[0]}).id;
        const member = message.guild.members.cache.get(userID);
        if (!member) message.reply("tu n'as mentionné personne ou la mention était incorrecte");
        const mutedRole = message.guild.roles.cache.get("695330946844721312");
        member.roles.remove(mutedRole.id);
        message.channel.send(`${member.user} a été unmute`);
    }
};