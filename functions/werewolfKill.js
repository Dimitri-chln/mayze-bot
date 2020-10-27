module.exports = function werewolfKill(message, player) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    
    gameData.players.find(p => p.id === player.id).alive = false;
    var role = message.guild.roles.cache.find(r => r.name === player.role);
    const member = message.guild.members.cache.get(player.id);
    member.roles.add(role.id);
    member.roles.remove("759701843864584202");
    member.roles.remove("759702019207725089");
    
    // couple check then
    dataWrite("werewolfGameData.json", gameData);
    const checkWin = require("./werewolfCheckWin.js");
    checkWin(message);
};