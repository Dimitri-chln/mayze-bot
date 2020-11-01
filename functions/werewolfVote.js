module.exports = function vote(message) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    
    if (!gameData.players.length) return;
    
    const alivePlayers = gameData.players.filter(p => p.alive);
    villageChannel.send({
        embed: {
            title: "Votes pour savoir qui éliminer !",
            color: "#010101",
            description: alivePlayers.map((p, i) => `\`${i+1}.\` ${message.client.users.cache.get(p.id).username}`).join("\n"),
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    }).then(msg => {
        const votes = [];
        for (i = 0; i < alivePlayers.length; i++) {
            votes.push(0);
        };
        const filter = function(response) {
            const number = parseInt(response, 10);
            return !isNaN(number) && number > 0 && number <= alivePlayers.length;
        };
        if (!dataRead("werewolfGameData.json").players.length) return;
        msg.channel.awaitMessages(filter, {time: 30000})
        .then(collected => {
            if (!dataRead("werewolfGameData.json").players.length) return;
            alivePlayers.forEach(p => {
                const vote = collected.filter(c => c.author.id === p.id).last();
                if (vote) {
                    votes[parseInt(vote.content, 10) -1] ++;
                };
            });
            villageChannel.send({
                embed: {
                    title: "Résultat des votes:",
                    color: "#010101",
                    description: alivePlayers.map((p, i) => `\`${i+1}.\` **${message.client.users.cache.get(p.id).username}** - ${votes[i]} vote(s)`).join("\n"),
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            });
            const max = Math.max(...votes);
            var lynched = votes.indexOf(max);
            if (votes.filter(v => v === max).length > 1) lynched = -1;
            if (lynched + 1) {
                const lynchedPlayer = alivePlayers[lynched];
                villageChannel.send(`Le village a décidé d'éliminer **${message.client.users.cache.get(lynchedPlayer.id).username}** qui était ${lynchedPlayer.role}`);
                if (lynchedPlayer.role === "Ange") {
                    villageChannel.send("L'ange a gagné !");
                    const end = require("../functions/werewolfEnd.js");
                    return end(message, gameData);
                };
                const kill = require("./werewolfKill.js");
                gameData = kill(message, gameData, lynchedPlayer.id);
            } else {
                villageChannel.send("Personne n'a été éliminé aujourd'hui");
            };
            dataWrite("werewolfGameData.json", gameData);
            const night = require("./werewolfNight.js");
            setTimeout(() => {
                if (!dataRead("werewolfGameData.json").players.length) return
                night(message);
            }, 3000);
        });
    });
};