module.exports = {
    execute(message) {
        if (message.client.herokuMode) return;
        const dataRead = require("../functions/dataRead.js");
        const dataWrite = require("../functions/dataWrite.js");
        var gameData = dataRead("werewolfGameData.json");
        if (!gameData.night) return;
        const alivePlayers = gameData.players.filter(p => p.alive && p.id !== message.author.id);
        
        if (message.channel.id === "759702367800786964" && !message.author.bot && !message.content.startsWith("*ww kill ")) {
            const petiteFilleChannel = message.client.channels.cache.get("764767902124474378");
            petiteFilleChannel.send(message.content);
        };
        dataWrite("werewolfGameData.json", gameData);
    }
};