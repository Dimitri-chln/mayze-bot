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
        gameData.votes = {};
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
            alivePlayers.forEach(p => {
                const vote = collected.filter(c => c.author.id === p.id).last();
                if (vote) {
                    votes[parseInt(vote.content, 10) -1] ++;
                };
            });
            const max = Math.max(...votes);
            var lynched = votes.indexOf(max);
            if (votes.filter(v => v === max).length > 1) lynched = null;
            if (lynched) {
                const kill = require("./werewolfKill.js");
                const lynchedPlayer = gameData.players.filter(p => p.alive)[lynched];
                msg.channel.send(`Le village a décidé d'éliminer **${message.client.users.cache.get(lynchedPlayer.id).username}**`)
                gameData = kill(message, lynchedPlayer.id);
            } else {
                msg.channel.send("Personne n'a été éliminé aujourd'hui");
            };
            const night = require("./werewolfNight.js");
            setTimeout(() => { night(message) }, 3000);
        });
        
        gameData.votes = {};
        dataWrite("werewolfGameData.json", gameData);
    });
};