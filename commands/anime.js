module.exports = {
    name: "anime",
    description: "Épisodes d'animés",
    aliases: ["a"],
    args: 0,
    usage: "?",
    execute(message, args) {
        const dataRead = require("../functions/dataRead.js");
        const dataWrite = require("../functions/dataWrite.js");
        var animes = dataRead("animes.json");
        var userAnimes = animes[message.author.id];
        if (args[1] === "add") {
            
        } else if (args[1] === "remove") {
            
        } else {
            const desc = userAnimes.map(a => `**${a.name}**: ${a.seasons.forEach((s, i) => {
                    const index = s.indexOf(false);
                    if (index > -1) {
                        return `Saison ${i+1} - Épisode ${index+1}`;
                    }
                })}`).join("\n");
            message.channel.send({
                embed: {
                    author: {
                        name: "Parties Among Us en cours",
                        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    color: "#010101",
                    desription: desc,
                    footer: {
                        text: "✨ Mayze ✨"
                    }
                }
            });
        };
    }
};