module.exports = function werewolfNight(message) {
    const dataRead = require("./dataRead.js");
    const dataWrite = require("./dataWrite.js");
    var gameData = dataRead("werewolfGameData.json");
    const villageChannel = message.guild.channels.cache.get("759700750803927061");
    villageChannel.updateOverwrite(message.guild.roles.cache.get("759699864191107072"), {"SEND_MESSAGES": false});
    villageChannel.send({
        embed: {
            title: "La nuit tombe sur le village...",
            color: "#010101",
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    });
    gameData.night = true;
    gameData.death = [];
    const rolePartie = message.guild.roles.cache.get("759699864191107072");
    message.guild.channels.cache.get("759700750803927061").updateOverwrite(rolePartie, {"SEND_MESSAGES": false});
    const roleWerewolf = message.guild.roles.cache.get("759701843864584202");
    message.guild.channels.cache.get("759702367800786964").updateOverwrite(rolePartie, {"SEND_MESSAGES": null});
    const petiteFilleChannel = message.client.channels.cache.get("764767902124474378");
    petiteFilleChannel.send({
        embed: {
            title: "Début de la nuit",
            color: "#010101",
            description: "Espionne les loups-garous !",
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    });
    const alivePlayers = gameData.players.filter(p => p.alive);
    const werewolvesChannel = message.guild.channels.cache.get("759702367800786964");
    gameData.canWerewolvesKill = true;
    werewolvesChannel.send({
        embed: {
            title: "Indiquez la personne que vous voulez tuer avec la commande `*ww kill <numéro>`",
            color: "#010101",
            description: alivePlayers.filter(player => player.role !== "Loup-garou").map((player, i) => `\`${i+1}.\` ${player.username}`).join("\n"),
            footer: {
                text: "🐺 Mayze 🐺"
            }
        }
    });
    alivePlayers.forEach(p => {
        if (p.role === "Loup-garou") {
            message.client.users.cache.get(p.id).send({
                embed: {
                    title: "C'est l'heure de tuer quelqu'un !",
                    color: "#010101",
                    description: "Vas voir <#759702367800786964> pour discuter avec les autres loups-garous",
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
        } else if (p.role === "Voyante") {
            message.client.users.cache.get(p.id).send({
                embed: {
                    title: "Indique le numéro de la personne dont tu veux connaître le rôle",
                    color: "#010101",
                    description: alivePlayers.filter(player => player.id !== p.id).map((player, i) => `\`${i+1}.\` ${player.username}`).join("\n"),
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            }).then(msg => {
                const filter = function(response) {
                    const number = parseInt(response, 10);
                    return !isNaN(number) && number > 0 && number < alivePlayers.length;
                };
                msg.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
                .then(collected => {
                    const n = parseInt(collected.first());
                    msg.channel.send(`**${alivePlayers.filter(player => player.id !== p.id)[n-1].username}** est __${alivePlayers.filter(player => player.id !== p.id)[n-1].role}__!`);
                }).catch(collected => {
                    if (!dataRead("werewolfGameData.json").players.length) return;
                    msg.channel.send("Tu n'as pas répondu à temps");
                });
            }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
        } else if (p.role === "Sorcière") {
            // 👀
        } else if (p.role === "Cupidon") {
            if (!gameData.couple) {
                message.client.users.cache.get(p.id).send({
                    embed: {
                        title: "Indique les numéros des deux personnes que tu veux mettre en couple, séparés par une virgule",
                        color: "#010101",
                        description: alivePlayers.filter(player => player.id !== p.id).map((player, i) => `\`${i+1}.\` ${player.username}`).join("\n"),
                        footer: {
                            text: "🐺 Mayze 🐺"
                        }
                    }
                }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
            };
        } else if (p.role === "Petite fille") {
            message.client.users.cache.get(p.id).send({
                embed: {
                    title: "Espionne les loups-garous !",
                    color: "#010101",
                    description: "Vas voir <#764767902124474378> pour espionner leur conversation",
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
        } else if (p.role === "Chasseur") {
            message.client.users.cache.get(p.id).send({
                embed: {
                    title: "Indique le numéro de la personne que tu veux tuer lors de ta mort",
                    color: "#010101",
                    description: alivePlayers.filter(player => player.id !== p.id).map((player, i) => `\`${i+1}.\` ${player.username}`).join("\n"),
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            }).then(msg => {
                const filter = function(response) {
                    const number = parseInt(response, 10);
                    return !isNaN(number) && number > 0 && number < alivePlayers.length;
                };
                msg.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ["time"]})
                .then(collected => {
                    const n = parseInt(collected.first());
                    gameData.chasseurAvenge = alivePlayers.filter(player => player.id !== p.id)[n-1].id;
                    msg.channel.send(`**${message.client.users.cache.get(gameData.chasseurAvenge).username} sera tué lors de ta mort`);
                }).catch(collected => {
                    if (!dataRead("werewolfGameData.json").players.length) return;
                    msg.channel.send("Tu n'as pas répondu à temps");
                });
            }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
        } else {
            message.client.users.cache.get(p.id).send({
                embed: {
                    title: "Rien à faire cette nuit...",
                    color: "#010101",
                    description: "Fais de beaux rêves 😴",
                    footer: {
                        text: "🐺 Mayze 🐺"
                    }
                }
            }).catch(error => {
                console.error(error);
                console.log(`Could not send message to ${p.user.username} (${p.id})`);
            });
        }
    });
    dataWrite("werewolfGameData.json", gameData);
};