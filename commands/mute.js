module.exports = {
    name: "mute",
    description: "Mute une personne sur le serveur pendant un temps donné",
    aliases: [],
    args: 1,
    usage: "<mention/id> [durée]",
    perms: ["MANAGE_ROLES"],
    execute(message, args) {
        const dhms = require ("dhms");
        const dateToString = require("../functions/dateToString.js");
        
        const userID = (message.mentions.users.first() || {"id": args[0]}).id;
        const member = message.guild.members.cache.get(userID);
        if (!member) message.reply("tu n'as mentionné personne ou la mention était incorrecte");
        if (member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply("tu ne peux pas mute cette personne");
        };
        
        var duration = args.slice(1).join(" ");
        var durationResponse = "indéfiniment";
        if (duration) {
            duration = dhms(duration, true);
            const durationHumanized = dateToString(duration);
            if (durationHumanized) {
                durationResponse = `pendant ${durationHumanized}`;
            };
        };
        const mutedRole = message.guild.roles.cache.get("695330946844721312");
        member.roles.add(mutedRole.id);
        message.channel.send(`${member.user} a été mute ${durationResponse}`)
        if (duration) {
            setTimeout(function() {
                member.roles.remove(mutedRole.id);
            }, duration * 1000);
        };
    }
};