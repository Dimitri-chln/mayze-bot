module.exports = function werewolfKill(message, gameData, playerID) {
    
    const player = gameData.players.find(p => p.id === playerID);
    const index = gameData.players.indexOf(player);
    gameData.players[index].alive = false;
    var role = message.guild.roles.cache.find(r => r.name === player.role);
    const member = message.guild.members.cache.get(player.id);
    member.roles.add(role.id);
    member.roles.remove("759701843864584202");
    member.roles.remove("759702019207725089");
    
    if (player.role === "Petite fille") {
        const overwritePetiteFille = message.client.channels.cache.get("764767902124474378").permissionOverwrites.get(player.id);
        if (overwritePetiteFille) overwritePetiteFille.delete();
    };
    
    // couple check then
    
    return gameData;
    const checkWin = require("./werewolfCheckWin.js");
    checkWin(message, gameData);
};