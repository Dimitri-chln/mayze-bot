module.exports = function werewolfCheckWin(message, gameData, night) {
    const dataRead = require("./dataRead.js");
    const werewolves = gameData.players.filter(p => p.role === "Loup-garou");
    const villagers = gameData.players.filter(p => p.role !== "Loup-garou");
    const end = require("./werewolfEnd.js");
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    
    if (!werewolves.length) {
        villageChannel.send("Le village a gagné !");
        return ndd(message, gameData);
    };
    if (werewolves.length >= villagers.length) {
        villageChannel.send("Les loups-garous ont gagné !");
        return ndd(message, gameData);
    };
    return;
};