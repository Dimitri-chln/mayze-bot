module.exports = function day(message) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    
    gameData.night = false;
    const rolePartie = message.guild.roles.cache.get("759699864191107072");
    message.guild.channels.cache.get("759700750803927061").updateOverwrite(rolePartie, {"SEND_MESSAGES": null});
    const roleWerewolf = message.guild.roles.cache.get("759701843864584202");
    message.guild.channels.cache.get("759702367800786964").updateOverwrite(rolePartie, {"SEND_MESSAGES": false});
    gameData.players.forEach((p, i) => {
        if (gameData.death.includes(p.id)) {
            gameData.players[i].alive = false;
            var role = message.guild.roles.cache.find(r => r.name === p.role);
            const member = message.guild.members.cache.get(p.id);
            member.roles.add(role.id);
            member.roles.remove("759701843864584202");
            member.roles.remove("759702019207725089");
        };
    });
    var desc = `Les joueurs morts cette nuit sont:\n${gameData.death.map(d => `• _**${message.client.users.cache.get(d).username}** qui était ${gameData.players.find(p => p.id === d).role}`).join("\n")}_`;
    if (!gameData.death.length) desc = "Aucun joueur n'est mort cette nuit !";
    villageChannel.send({
        embed: {
            title: "Le jour se lève sur le village...",
            color: "#010101",
            description: desc,
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    });
    gameData.death = [];
    const werewolves = gameData.players.filter(p => p.role === "Loup-garou");
    const villagers = gameData.players.filter(p => p.role !== "Loup-garou");
    const end = require("../functions/werewolfEnd.js");
    if (werewolves.length >= villagers.length) {
        villageChannel.send("Les loups-garous ont gagné !");
        end(message);
    } else if (werewolves.length === 0) {
        villageChannel.send("Le village a gagné !");
        end(message);
    };
    dataWrite("werewolfGameData.json", gameData);
    
    const vote = require("../functions/werewolfVote.js");
    setTimeout(function() {
        vote(message);
    }, 90000);
};