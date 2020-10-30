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
        
        switch ((args[0] || "").toLowerCase()) {
            case "info":
                if (!userAnimes) return;
                const input = args.slice(1).join(" ");
                const anime = userAnimes.find(a => 
                    a.name.toLowerCase() === input.toLowerCase() ||
                    new RegExp(a.altNames, "i").test(input)
                );
                if (!anime) return message.reply("je n'ai pas trouvé cet animé dans ta liste");
                var nextEpisode = "∅";
                if (anime.nextEp) nextEpisode = `\`Saison ${anime.nextEp[0]} - Épisode ${anime.nextEp[1]}\``;
                message.channel.send({
                    embed: {
                        author: {
                            name: anime.name,
                            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                        },
                        color: "#010101",
                        description: `${anime.seasons.map((s, i) => `• **Saison ${i+1}**: ${s} épisodes`).join("\n")}\n\n__**Prochain épisode:**__ **${nextEpisode}**`,
                        footer: {
                            text: "✨ Mayze ✨"
                        }
                    }
                });
                break;
            default:
                if (!userAnimes) return;
                message.channel.send({
                    embed: {
                        author: {
                            name: `Animés de ${message.author.username}`,
                            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                        },
                        color: "#010101",
                        description: userAnimes.map(a => {
                            var string = `• **${a.name}** → `;
                            if (a.nextEp) {
                                string += `\`Saison ${a.nextEp[0]} - Épisode ${a.nextEp[1]}\``;
                            } else {
                                string += "✅";
                            };
                            return string;
                        }).join("\n"),
                        footer: {
                            text: "✨ Mayze ✨"
                        }
                    }
                });
        };
    }
};