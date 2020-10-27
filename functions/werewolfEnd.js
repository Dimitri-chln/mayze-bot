module.exports = function werewolfEnd(message) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    const roles = [/*"759699864191107072", */"759701843864584202", "759702019207725089", "759703669221359637", "759703558445727786", "759703743104548894", "759703827133497386", "759703894720380928", "759703955956957205", "759704017570889728", "759704083173998604", "759704177587912704"];
    
    if (!gameData.players.length) return message.reply("je n'ai pas pu terminer la partie");
    const petiteFilleChannel = message.client.channels.cache.get("764767902124474378");
    petiteFilleChannel.messages.fetch({limit: (gameData.petiteFilleMessages || 1)}).then(messages => {
        petiteFilleChannel.bulkDelete(messages);
    });
    const rolePartie = message.guild.roles.cache.get("759699864191107072");
    message.guild.channels.cache.get("759700750803927061").updateOverwrite(rolePartie, {"SEND_MESSAGES": null});
    gameData.players.forEach(p => {
        const member = message.guild.members.cache.get(p.id);
        roles.forEach(r => {
            if (member.roles.cache.some(role => role.id === r)) {
                member.roles.remove(r);
            };
        });
        if (p.role === "Chaman") {
            const overwriteChaman = message.client.channels.cache.get("759702659530883095").permissionOverwrites.get(p.id);
            if (overwriteChaman) overwriteChaman.delete();
        };
        if (p.role === "Petite fille") {
            const overwritePetiteFille = message.client.channels.cache.get("764767902124474378").permissionOverwrites.get(p.id);
            if (overwritePetiteFille) overwritePetiteFille.delete();
        };
    });
    
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    villageChannel.send({
        embed: {
            title: "Rôles de cette partie :",
            color: "#010101",
            description: gameData.players.map(function(p) {
                var dead = "";
                if (!p.alive) {
                    dead = " (mort)";
                };
                return `${message.client.users.cache.get(p.id)} - ${p.role}${dead}`;
            }).join("\n"),
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    });
    
    dataWrite("werewolfGameData.json", {"players": []});
    message.channel.send("Partie terminée!");
};