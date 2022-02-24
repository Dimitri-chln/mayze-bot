module.exports = {
	get: require("../utils/parseLanguageText"),
	data: {
		werewolf: {
			unauthorized_guild: {
				fr: "cette commande ne fonctionne pas sur ce serveur",
				en: "this command isn't available on this server",
			},
			ongoing: {
				fr: "une partie est déjà en cours, reviens plus tard !",
				en: "there is already an ongoing game, come back later!",
			},
			max_players: {
				fr: "il y a déjà 16 joueurs dans la partie :/",
				en: "there are already 16 players in the game :/",
			},
			joined: {
				fr: "{1} a rejoint la partie de Loups-garous",
				en: "{1} joined the next Werewolf game",
			},
			already_started: {
				fr: "la partie a déjà commencé !",
				en: "the game already started!",
			},
			left: {
				fr: "{1} a quitté la partie de Loups-garous",
				en: "{1} left the next Werewolf game",
			},
			unauthorized: {
				fr: "tu n'as pas les permissions nécessaires",
				en: "you don't have enough permissions",
			},
			start_msg_title: {
				fr: "La partie va commencer...",
				en: "The game is going to start...",
			},
			start_msg_description: {
				fr: "Réagis avec 🐺 pour pouvoir jouer",
				en: "React with 🐺 to play",
			},
			not_enough_players: {
				fr: "Il faut au minimum 4 joueurs pour pouvoir lancer la partie",
				en: "There needs to be at least 4 players to start the game",
			},
			welcome: {
				fr: "Bienvenue dans cette partie de Loups-garous ! Ton rôle est **{1}** 🐺",
				en: "Welcome in this Werewolf game! Your role is **{1}** 🐺",
			},
			started_content: {
				fr: "{1} la partie vient de commencer !",
				en: "{1} the game just started!",
			},
			started_title: {
				fr: "Rôles de cette partie :",
				en: "This game's roles:",
			},
			no_game: {
				fr: "il n'y a pas de partie en cours !",
				en: "there is no ongoing game!",
			},
			config: {
				fr: "Config Loups-garous",
				en: "Werewolf config",
			},
			config_description: {
				fr: "• Rôle joueur : {1}\n• Rôle villagois : {2}\n• Rôle loup-garou : {3}\n• Salon du village : {4}\n• Salon des loups-garous : {5}\n• Salon des morts : {6}",
				en: "• Player role: {1}\n• Villager role: {2}\n• Werewolf role: {3}\n• Village channel: {4}\n• Werewolves channel: {5}\n• Dead channel: {6}",
			},
			force_removed: {
				fr: "**{1}** joueur[2?s:] [2?ont:a] été retiré[2?s:]\n → {3}",
				en: "**{1}** player[2?s:] [2?have:has] been removed\n → {3}",
			},
			player_list: {
				fr: "Liste des joueurs :",
				en: "Player list:",
			},
			fields: {
				fr: ["Joueurs :", "Rôles :"],
				en: ["Players:", "Roles:"],
			},
			no_player: {
				fr: "*Aucun joueur*",
				en: "*No player*",
			},
		},
	},
};
