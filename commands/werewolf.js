module.exports = {
    name: "werewolf",
    description: "Joue aux Loups-garous sur Discord",
    aliases: ["ww", "lg"],
    args: 1,
    usage: "<commande> [arguments supplémentaires]",
    execute(message, fullArgs) {
        if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
        const command = fullArgs[0].toLowerCase();
        const args = fullArgs.splice(1);
        const dataRead = require("../functions/dataRead.js");
        const dataWrite = require("../functions/dataWrite.js");
        const shuffle = require("../functions/shuffle.js");
        const end = require ("../functions/werewolfEnd.js");
        const night = require ("../functions/werewolfNight");
        const werewolfData = require("../database/werewolfData.json");
        const villageChannel = message.client.channels.cache.get("759700750803927061");
        var gameData = dataRead("werewolfGameData.json");
        switch (command) {
            case "join":
                if (gameData.players.length) return message.reply("une partie est déjà en cours, reviens plus tard!");
                message.member.roles.add("759699864191107072");
                if (message.member.roles.cache.some(r => r.id === "689180158359371851")) {
                    // Administrateur
                    message.member.roles.remove("689180158359371851");
                    message.member.roles.add("753245162469064795");
                }
                if (message.member.roles.cache.some(r => r.id === "737646140362850364")) {
                    // Modérateur
                    message.member.roles.remove("737646140362850364");
                    message.member.roles.add("753250476891439185");
                }
                message.channel.send(`${message.author} a rejoint une partie de Loups-garous`);
                break;
            case "leave":
                if (gameData.players.length) return message.reply("la partie a déjà commencé!");
                message.member.roles.remove("759699864191107072");
                if (message.member.roles.cache.some(r => r.id === "753245162469064795")) {
                    // Administrateur
                    message.member.roles.remove("753245162469064795");
                    message.member.roles.add("689180158359371851");
                }
                if (message.member.roles.cache.some(r => r.id === "753250476891439185")) {
                    // Modérateur
                    message.member.roles.remove("753250476891439185");
                    message.member.roles.add("737646140362850364");
                }
                message.channel.send(`${message.author} a quitté la partie de Loups-garous`);
                break;
            case "start":
                if (message.channel.id !== "759700750803927061") return;
                if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("tu n'as pas les permissions nécessaires");
                if (gameData.players.length) return message.reply("la partie a déjà commencé!");
                var players = message.guild.members.cache.filter(m => m.roles.cache.some(r => r.id === "759699864191107072")).array();
                players = shuffle(players);
                if (players.length < 4) return message.reply(`il faut au minimum 4 joueurs pour pouvoir lancer la partie (actuellement ${players.length})`);
                const composition = werewolfData[players.length];
                var playersData = [];
                players.forEach((p, i) => {
                    const werewolves = ["Loup-garou"];
                    var villagers = werewolfData.villagerRoles;
                    var role;
                    // ---------
                    if (p.id === "307815349699608577") {
                        role = "Sorcière";
                        p.roles.add("759702019207725089");
                    }
                    // ---------
                    else if (i < composition.werewolves) {
                        role = werewolves[i];
                        p.roles.add("759701843864584202");
                    } else if (i === composition.werewolves) {
                        role = "Voyante";
                        p.roles.add("759702019207725089");
                    } else {
                        role = villagers[Math.floor(Math.random()*villagers.length)];
                        p.roles.add("759702019207725089");
                        if (role !== "Villageois simple") {
                            villagers = villagers.splice(villagers.indexOf(role), 1);
                        };
                    };
                    if (role === "Chaman") {
                        message.guild.channels.cache.get("759702659530883095").updateOverwrite(p.user, {"VIEW_CHANNEL": true, "SEND_MESSAGES": false});
                    };
                    if (role === "Petite fille") {
                        message.guild.channels.cache.get("764767902124474378").updateOverwrite(p.user, {"VIEW_CHANNEL": true, "SEND_MESSAGES": false});
                    };
                    p.send(`Bienvenue dans cette partie de Loups-garous! Ton rôle est **${role}** 🐺`).catch(error => {
                        console.error(error);
                        console.log(`Could not send message to ${p.user.username} (${p.id})`);
                    });
                    playersData.push({"id": p.id, "role": role, "alive": true});
                });
                dataWrite("werewolfGameData.json", {"players": playersData, "death": [], "canWitchSave": true});
                console.log(playersData);
                const roleListString = playersData.map(p => "• " + p.role).join("\n");
                villageChannel.send({
                    content: "<@&759699864191107072> la partie vient de commencer!",
                    embed: {
                        title: "__Rôles de cette partie :__",
                        description: roleListString,
                        color: "#010101",
                        footer: {
                            text: "🐺 Mayze 🐺"
                        }
                    }
                });
                night(message);
                break;
            case "end":
                if (message.channel.id !== "759700750803927061") return;
                if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("tu n'as pas les permissions nécessaires");
                end(message);
                break;
            case "night":
                if (message.channel.id !== "759700750803927061") return;
                if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("tu n'as pas les permissions nécessaires");
                if (!gameData.players.length) return message.reply("il n'y a pas de partie en cours");
                if (gameData.night) return message.reply("c'est déjà la nuit 👀");
                night(message);
                break;
            case "kill":
                if (message.channel.id !== "759702367800786964") return;
                if (!gameData.night) return;
                if (!gameData.canWerewolvesKill) return;
                gameData.canWerewolvesKill = false;
                const alivePlayers = gameData.players.filter(p => p.alive && p.role !== "Loup-garou");
                const number = parseInt(args[0], 10);
                if (isNaN(number) || number < 1 || number > alivePlayers.length) {
                    return message.channel.send(`Le premier argument doit être un nombre compris entre 1 et ${alivePlayers.length}`);
                };
                gameData.death.push(alivePlayers[number-1].id);
                dataWrite("werewolfGameData.json", gameData);
                message.channel.send(`Les loups-garous ont décidé de tuer **${message.client.users.cache.get(alivePlayers[number-1].id).username}**`);
                if (!gameData.players.some(player => player.role === "Sorcière")) return;
                const witch = message.client.users.cache.get(gameData.players.find(player => player.role === "Sorcière").id);
                if (!gameData.players.find(w => w.role === "Sorcière").alive) {
                    const day = require("../functions/werewolfDay.js");
                    return setTimeout(function() {
                        day(message)
                    }, 30000);
                };
                var desc = `**${message.client.users.cache.get(gameData.death[0]).username}**, souhaite tu le sauver?`;
                if (!gameData.canWitchSave) {
                    desc = `**${message.client.users.cache.get(gameData.death[0]).username}**, mais tu ne peux pas le sauver`;
                };
                witch.send({
                    embed: {
                        title: "Les loups-garous ont décidé de tuer :",
                        color: "#010101",
                        description: desc,
                        footer: {
                            text: "🐺 Mayze 🐺"
                        }
                    }
                }).then(msg => {
                    if (gameData.canWitchSave) {
                        msg.react("✅").then(() => msg.react("❌"));
                        const filter = (reaction, user) => {
                            return ["✅", "❌"].includes(reaction.emoji.name) && !user.bot;
                        };
                        msg.awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]})
                        .then(collected => {
                            if (collected.first().emoji.name === "✅") {
                                msg.edit({
                                    embed: {
                                        title: "Les loups-garous ont décidé de tuer :",
                                        color: "#010101",
                                        description: `**${message.client.users.cache.get(gameData.death[0]).username}**, mais tu l'as sauvé !`,
                                        footer: {
                                            text: "🐺 Mayze 🐺"
                                        }
                                    }
                                });
                                gameData.death = gameData.death.splice(1);
                                gameData.canWitchSave = false;
                                dataWrite("werewolfGameData.json", gameData);
                            } else {
                                msg.edit({
                                    embed: {
                                        title: "Les loups-garous ont décidé de tuer :",
                                        color: "#010101",
                                        description: `**${message.client.users.cache.get(gameData.death[0]).username}**, mais tu ne l'as pas sauvé...`,
                                        footer: {
                                            text: "🐺 Mayze 🐺"
                                        }
                                    }
                                });
                            };
                        }).catch(collected => {
                            msg.edit({
                                embed: {
                                    title: "Les loups-garous ont décidé de tuer :",
                                    color: "#010101",
                                    description: `**${message.client.users.cache.get(gameData.death[0]).username}**, mais tu ne l'as pas sauvé...`,
                                    footer: {
                                        text: "🐺 Mayze 🐺"
                                    }
                                }
                            });
                        });
                    };
                });
                const day = require("../functions/werewolfDay.js");
                setTimeout(function() {
                    day(message)
                }, 20000);
                break;
            default:
                message.reply("cette commande n'existe pas");
        }
    }
};