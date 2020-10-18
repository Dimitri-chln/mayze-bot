module.exports = {
    name: "among-us",
    desription: "Donne ou obtiens le code d'une partie d'Among Us",
    aliases: ["amongUs", "au"],
    args: 0,
    usage: "[add <code> [description]] [delete]",
    execute(message, args) {
        const dateToString = require("../functions/dateToString.js");
        var games = message.client.amongUsGames || {};
        if (args[0] === "add" && /\w{6}/.test(args[1])) {
            games[message.author.id] = {"code": args[1], "description": args.splice(2).join(" ") || "Partie classique", "time": Date.now()};
            message.client.amongUsGames = games;
            message.channel.send("Partie ajoutée!");
        } else if (args[0] === "delete" && games[message.author.id]) {
            delete games[message.author.id];
            message.client.amongUsGames = games;
            message.channel.send("Partie supprimée!");
        } else {
            message.channel.send({
                embed: {
                    author: {
                        name: "Parties Among Us en cours",
                        icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                    },
                    color: "#010101",
                    description: Object.entries(games).map(e => `${message.client.users.cache.get(e[0])}: **${e[1].code}**\n*${e[1].description}*\n(il y a ${dateToString((Date.now() - e[1].time)/1000)})`).join("\n——————————\n") || "Aucune partie en cours!",
                    footer: {
                        text: "✨ Mayze ✨"
                    }
                }
            });
        };
    }
};