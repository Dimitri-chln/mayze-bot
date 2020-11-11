module.exports = {
    name: "nick",
    description: "Modifie ou réinitialise ton pseudo sur le serveur",
    aliases: ["name", "rename"],
    args: 0,
    usage: "[pseudo]",
    perms: ["CHANGE_NICKNAME"],
    async execute(message, args) {
        try {
            message.member.setNickname(args.join(" "));
            message.delete();
        } catch (err) {
            message.channel.send("Je n'ai pas la permission de changer ton pseudo");
        }
    }
};