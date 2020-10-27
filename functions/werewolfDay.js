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
    const kill = require("./werewolfKill.js");
    gameData.players.forEach((p, i) => {
        if (gameData.death.includes(p.id)) {
            kill(p);
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
    dataWrite("werewolfGameData.json", gameData);
    
    const vote = require("../functions/werewolfVote.js");
    setTimeout(function() {
        if (!dataRead("werewolfGameData.json").players.length) return;
        vote(message);
    }, 90000);
};