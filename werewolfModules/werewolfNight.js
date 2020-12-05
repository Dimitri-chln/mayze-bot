async function werewolfNight(message) {

	const { werewolfRoles } = require("../assets/werewolfInfo.json");
	const nonWerewolves = alivePlayers.filter(p => !werewolfRoles.includes(p.role));
	const werewolvesResult = await werewolfRequest(werewolvesChannel, nonWerewolves, "Quel joueur souhaitez-vous tuer ?").catch(console.error);
	console.log(werewolvesResult);

	alivePlayers.forEach(async p => {
		const { user } = message.client.users.cache.get(p.id);
		if (werewolfRoles.includes(p.role)) {
			user.send({
				embed: {
					title: "C'est l'heure de tuer quelqu'un !",
					color: "#010101",
					description: "Vas voir <#759702367800786964> pour discuter avec les autres loups-garous",
					footer: {
						text: "🐺 Mayze 🐺"
					}
				}
			}).catch(console.error);
		} else {
			switch (p.role) {
				case "Voyante":
					const notSeerPlayers = alivePlayers.filter(player => player.id !== p.id);
					const seerResult = await werewolfRequest(user, notSeerPlayers, "De quel joueur souhaites-tu connaître le rôle ?").catch(console.error);
					console.log(seerResult);
					break;
				case "Sorcière":
					user.send("Le nom du joueur attaqué par les loups-garous s'affichera lorsqu'ils auront fait leur choix").catch(console.error);
					break;
				case "Cupidon":
					if (!players.some(player => player.couple)) {
						const notCupidPlayers = alivePlayers.filter(player => player.id !== p.id);
						// Ajouter deux requêtes
					}
					break;
				case "Petite fille":
					user.send({
						embed: {
							title: "Espionne les loups-garous !",
							color: "#010101",
							description: "Vas voir <#764767902124474378> pour espionner leur conversation",
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
					break;
				case "Chasseur":
					const notAvengerPlayers = alivePlayers.filter(player => player.id !== p.id);
					const avengerResult = await werewolfRequest(user, notAvengerPlayers, "Quel joueur souhaites-tu tuer lors de ta mort ?").catch(console.error);
					console.log(avengerResult);
					break;
				default:
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
		}
	});
	dataWrite("werewolfGameData.json", gameData);
};

module.exports = werewolfNight;