module.exports = function werewolfKill(message, player) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    gameData.players[player].alive = false;
    // couple check then
    dataWrite("werewolfGameData.json", gameData);
    const checkWin = require("./werewolfCheckWin.js");
    checkWin(message);
};