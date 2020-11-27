module.exports = function werewolfKill(message, gameData, playerID) {
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
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
    if (p.role === "Chaman") {
        const overwriteChaman = message.client.channels.cache.get("759702659530883095").permissionOverwrites.get(p.id);
        if (overwriteChaman) overwriteChaman.delete();
    };
    if (p.role === "Chasseur" && gameData.chasseurAvenge) {
        villageChannel.send(`Le chasseur est mort et a décidé d'emmener **${message.client.users.get(gameData.chasseurAvenge).username}** avec lui`)
        werewolfKill(message, gameData, gameData.chasseurAvenge);
    };
    
    // couple check then
    
    return gameData;
};