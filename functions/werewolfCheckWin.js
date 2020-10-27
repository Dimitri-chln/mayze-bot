module.exports = function werewolfCheckWin(message) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    const werewolves = gameData.players.filter(p => p.role.includes("Loup-garou"));
    const villagers = gameData.players.filter(p => !p.role.includes("Loup-garou"));
    const end = require("./werewolfEnd.js");
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    
    if (!werewolves.length) {
        villageChannel.send("Le village a gagné !");
        end(message);
    };
    if (werewolves.length >= villagers.length) {
        villageChannel.send("Les loups-garous ont gagné !");
        end(message);
    };
};