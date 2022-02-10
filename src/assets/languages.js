module.exports = {
	get: require("../utils/parseLanguageText"),
	data: {
		errors: {
			database: {
				fr: "Quelque chose s'est mal passé en accédant à la base de données :/",
				en: "Something went wrong when accessing the database :/"
			},
			shell: {
				fr: "Erreur",
				en: "Error"
			},
			api: {
				fr: "Quelque chose s'est mal passé en accédant à l'API {1} :/",
				en: "Something went wrong when accessing the {1} API :/"
			},
			api_limit: {
				fr: "La limite de requêtes à l'API {1} a été atteinte, réessaie plus tard :/",
				en: "The request limit has been hit for the {1} API, try again later :/"
			},
			msg_too_long: {
				fr: "Le message est trop long pour que je puisse l'envoyer :/",
				en: "The message is too long for me to send it :/"
			},
			fetching_msg: {
				fr: "Quelque chose s'est mal passé en récupérant les messages :/",
				en: "Something went wrong when fetching the messages :/"
			},
			deleting_msg: {
				fr: "Quelque chose s'est mal passé en supprimant les messages :/",
				en: "Something went wrong when deleting the messages :/"
			},
			kicking: {
				fr: "Quelque chose s'est mal passé en t'expulsant du serveur :/",
				en: "Something went wrong when trying to kick you from the server :/"
			},
			message_send: {
				fr: "Quelque chose s'est mal passé en envoyant le message :/",
				en: "Something went wrong when sending the message :/"
			},
			no_perms: {
				fr: "Je n'ai pas les permissions nécessaires pour faire cela :/",
				en: "I don't have the required permissions to do this :/"
			},
			paginator: {
				fr: "Quelque chose s'est mal passé avec le paginateur :/",
				en: "Something went wrong with the paginator :/"
			},
			invalid_args: {
				fr: "arguments incorrects",
				en: "invalid arguments"
			},
			webhook_create: {
				fr: "Quelque chose s'est mal passé en créant un webhook :/",
				en: "Something went wrong when creating a webhook :/"
			},
			dm_disabled: {
				fr: "Quelque chose s'est mal passé en t'envoyant un message. As-tu désactivé les DM ?",
				en: "Something went wrong when sending you a message. Have you disabled DMs?"
			},
			heroku: {
				fr: "cette commande ne fonctionne pas sur Heroku",
				en: "this command doesn't work on Heroku"
			},
			role_color: {
				fr: "Quelque chose s'est mal passé en changeant la couleur du rôle :/",
				en: "Something went wrong when changing the role's color :/"
			},
			not_in_vc: {
				fr: "tu n'es pas dans le même salon vocal que moi",
				en: "you aren't in the same voice channel as me"
			},
			no_music: {
				fr: "Il n'y a aucune musique en cours sur ce serveur",
				en: "There is no music being played in this server"
			}
		},
		"werewolf": {
			unauthorized_guild: {
				fr: "cette commande ne fonctionne pas sur ce serveur",
				en: "this command isn't available on this server"
			},
			ongoing: {
				fr: "une partie est déjà en cours, reviens plus tard !",
				en: "there is already an ongoing game, come back later!"
			},
			max_players: {
				fr: "il y a déjà 16 joueurs dans la partie :/",
				en: "there are already 16 players in the game :/"
			},
			joined: {
				fr: "{1} a rejoint la partie de Loups-garous",
				en: "{1} joined the next Werewolf game"
			},
			already_started: {
				fr: "la partie a déjà commencé !",
				en: "the game already started!"
			},
			left: {
				fr: "{1} a quitté la partie de Loups-garous",
				en: "{1} left the next Werewolf game"
			},
			unauthorized: {
				fr: "tu n'as pas les permissions nécessaires",
				en: "you don't have enough permissions"
			},
			start_msg_title: {
				fr: "La partie va commencer...",
				en: "The game is going to start..."
			},
			start_msg_description: {
				fr: "Réagis avec 🐺 pour pouvoir jouer",
				en: "React with 🐺 to play"
			},
			not_enough_players: {
				fr: "Il faut au minimum 4 joueurs pour pouvoir lancer la partie",
				en: "There needs to be at least 4 players to start the game"
			},
			welcome: {
				fr: "Bienvenue dans cette partie de Loups-garous ! Ton rôle est **{1}** 🐺",
				en: "Welcome in this Werewolf game! Your role is **{1}** 🐺"
			},
			started_content: {
				fr: "{1} la partie vient de commencer !",
				en: "{1} the game just started!"
			},
			started_title: {
				fr: "Rôles de cette partie :",
				en: "This game's roles:"
			},
			no_game: {
				fr: "il n'y a pas de partie en cours !",
				en: "there is no ongoing game!"
			},
			config: {
				fr: "Config Loups-garous",
				en: "Werewolf config"
			},
			config_description: {
				fr: "• Rôle joueur : {1}\n• Rôle villagois : {2}\n• Rôle loup-garou : {3}\n• Salon du village : {4}\n• Salon des loups-garous : {5}\n• Salon des morts : {6}",
				en: "• Player role: {1}\n• Villager role: {2}\n• Werewolf role: {3}\n• Village channel: {4}\n• Werewolves channel: {5}\n• Dead channel: {6}"
			},
			force_removed: {
				fr: "**{1}** joueur[2?s:] [2?ont:a] été retiré[2?s:]\n → {3}",
				en: "**{1}** player[2?s:] [2?have:has] been removed\n → {3}"
			},
			player_list: {
				fr: "Liste des joueurs :",
				en: "Player list:"
			},
			fields: {
				fr: [ "Joueurs :", "Rôles :" ],
				en: [ "Players:", "Roles:" ]
			},
			no_player: {
				fr: "*Aucun joueur*",
				en: "*No player*"
			}
		},

		// MUSIC COMMANDS

		"auto-play": {
			toggled: {
				fr: "<a:blackCheck:803603780666523699> | **Autoplay [1?activé:désactivé]**",
				en: "<a:blackCheck:803603780666523699> | **Autoplay [1?enabled:disabled]**"
			}
		},
		"clear-queue": {
			deleted: {
				fr: "<a:blackCheck:803603780666523699> | **Queue supprimée**",
				en: "<a:blackCheck:803603780666523699> | **Queue deleted**"
			}
		},
		"loop": {
			looped: {
				fr: "<a:blackCheck:803603780666523699> | **Répétition de la musique [1?activée:désactivée]**",
				en: "<a:blackCheck:803603780666523699> | **Song loop [1?enabled:disabled]**"
			},
		},
		"lyrics": {
			no_song: {
				fr: "indique le nom d'une chanson",
				en: "give a song name"
			},
			no_lyrics: {
				fr: "je n'ai pas trouvé de paroles pour cette chanson",
				en: "I couldn't find any lyrics for this song"
			},
			title: {
				fr: "Paroles de \"{1}\"",
				en: "Lyrics of \"{1}\""
			},
			empty_lyrics: {
				fr: "*Aucune parole*",
				en: "*No lyrics*"
			}
		},
		"move": {
			invalid_song: {
				fr: "le numéro de la chanson est invalide",
				en: "the song number is invalid"
			},
			invalid_pos: {
				fr: "la position est invalide",
				en: "the position is invalid"
			},
			song_moved: {
				fr: "<a:blackCheck:803603780666523699> | **Musique déplacée**\n> {1}",
				en: "<a:blackCheck:803603780666523699> | **Song moved**\n> {1}"
			}
		},
		"now-playing": {
			now_playing: {
				fr: "Musique en cours",
				en: "Now playing"
			},
			description: {
				fr: "~s{1}~t({2})\n\n**{3}**\n\n`Ajouté par :` **{4}**\n`Suivant :` **{5}**\n`Durée de la queue :` **{6}**",
				en: "~s{1}~t({2})\n\n**{3}**\n\n`Requested by:` **{4}**\n`Next:` **{5}**\n`Queue duration:` **{6}**"
			},
			footer: {
				fr: "✨ Mayze ✨[1? | Répétition de la musique activée:][2? | Répétition de la queue activée:][3? | Autoplay activé:]",
				en: "✨ Mayze ✨[1? | Song loop enabled:][2? | Queue loop enabled:][3? | Autoplay enabled:]"
			},
			footer_end: {
				fr: "✨ Mayze ✨ | Queue terminée",
				en: "✨ Mayze ✨ | End of the queue"
			}
		},
		"pause": {
			paused: {
				fr: "<a:blackCheck:803603780666523699> | **Mis en pause**\n> {1}",
				en: "<a:blackCheck:803603780666523699> | **Paused**\n> {1}"
			}
		},
		"play-skip": {
			playlists_unsupported: {
				fr: "les playlists ne sont pas supportées pour cette commande",
				en: "playlists aren't supported for this command"
			}
		},
		"play-top": {
			playlists_unsupported: {
				fr: "les playlists ne sont pas supportées pour cette commande",
				en: "playlists aren't supported for this command"
			}
		},
		"play": {
			error_deezer: {
				fr: "Quelque s'est mal passé en récupérant le lien Deezer :/",
				en: "Something went wrong when retrieving the Deezer link :/"
			}
		},
		"playlist": {
			title: {
				fr: "Playlists de {1}",
				en: "{1}'s playlists"
			},
			unknown: {
				fr: "*Inconnu*",
				en: "*Unknown*"
			},
			no_playlist: {
				fr: "*Pas de playlist*",
				en: "*No playlist*"
			},
			footer_private: {
				fr: " | 🚫 signifie que la playlist est privée",
				en: " | 🚫 means that the playlist is private"
			},
			invalid_playlist: {
				fr: "il n'y a pas de playlist avec ce nom ou elle est privée",
				en: "there is no playlist with this name or it's private"
			},
			playlist_already_exists: {
				fr: "une playlist avec ce nom existe déjà",
				en: "a playlist with this name already exists"
			},
			missing_name: {
				fr: "ajoute un nom pour la playlist",
				en: "add a name for the playlist"
			},
			missing_url: {
				fr: "ajoute l'URL de la playlist",
				en: "add the playlist URL"
			},
			error_deezer: {
				fr: "Quelque s'est mal passé en récupérant le lien Deezer :/",
				en: "Something went wrong when retrieving the Deezer link :/"
			},
			invalid_url: {
				fr: "l'URL est invalide",
				en: "the URL is invalid"
			},
			playlist_created: {
				fr: "<a:blackCheck:803603780666523699> | **Playlist créée**",
				en: "<a:blackCheck:803603780666523699> | **Playlist created**"
			},
			playlist_deleted: {
				fr: "<a:blackCheck:803603780666523699> | **Playlist supprimée**",
				en: "<a:blackCheck:803603780666523699> | **Playlist deleted**"
			}
		},
		"queue-loop": {
			looped: {
				fr: "<a:blackCheck:803603780666523699> | **Répétition de la queue [1?activée:désactivée]**",
				en: "<a:blackCheck:803603780666523699> | **Queue loop [1?enabled:disabled]**"
			}
		},
		"queue": {
			author: {
				fr: "Queue de {1}",
				en: "{1}'s queue",
			},
			title: {
				fr: "Durée : **{1}**",
				en: "Duration: **{1}**"
			},
			no_song: {
				fr: "*Aucune musique*",
				en: "*No song*"
			},
			now_playing: {
				fr: "**En cours :**",
				en: "**Now playing:**"
			}
		},
		"remove": {
			invalid_input: {
				fr: "entre uniquement des nombres ou intervalles",
				en: "enter numbers or intervals only"
			},
			no_song: {
				fr: "il n'y a aucune musique à supprimer",
				en: "there is no song to remove"
			},
			invalid_numbers: {
				fr: "tous les nombres doivent être compris entre 1 et {1}",
				en: "all numbers must be between 1 and {1}"
			},
			removed: {
				fr: "<a:blackCheck:803603780666523699> | **{1} musique[2?s:] supprimée[2?s:]**{3}",
				en: "<a:blackCheck:803603780666523699> | **{1} song[2?s:] removed**{3}"
			}
		},
		"resume": {
			resumed: {
				fr: "<a:blackCheck:803603780666523699> | **Musique reprise**\n> {1}",
				en: "<a:blackCheck:803603780666523699> | **Song resumed**\n> {1}"
			}
		},
		"seek": {
			invalid_timestamp: {
				fr: "le format est incorrect (hh:mm:ss)",
				en: "the timestamp is invalid (hh:mm:ss)"
			},
			seeked: {
				fr: "<a:blackCheck:803603780666523699> | **Temps modifié ({1})**\n> {2}",
				en: "<a:blackCheck:803603780666523699> | **Timestamp seeked ({1})**\n> {2}"
			}
		},
		"shuffle": {
			shuffled: {
				fr: "<a:blackCheck:803603780666523699> | **Queue mélangée**\n> {1} musique[2?s ont été mélangées: a été mélangée 🤔]",
				en: "<a:blackCheck:803603780666523699> | **Queue shuffled**\n> {1} song[2?s:] have been shuffled[2? 🤔:]"
			}
		},
		"skip-to": {
			invalid_number: {
				fr: "le numéro de la chanson doit être compris entre 1 et {1}",
				en: "the song number must be between 1 and {1}"
			},
			skipped: {
				fr: "<a:blackCheck:803603780666523699> | **{1} musique[2?s:] passée[2?s:]**\n> {3}",
				en: "<a:blackCheck:803603780666523699> | **{1} song[2?s:] skipped**\n> {3}"
			}
		},
		"skip": {
			skipped: {
				fr: "<a:blackCheck:803603780666523699> | **Musique passée**\n> {1}",
				en: "<a:blackCheck:803603780666523699> | **Song skipped**\n> {1}"
			}
		},
		"stop": {
			stopped: {
				fr: "<a:blackCheck:803603780666523699> | **Musique arrêtée**",
				en: "<a:blackCheck:803603780666523699> | **Music stopped**"
			}
		},
		"volume": {
			invalid_volume: {
				fr: "le volume doit être compris entre 0 et 200",
				en: "the volume must be between 0 and 200"
			},
			volume_changed: {
				fr: "<a:blackCheck:803603780666523699> | **Volume modifié**\n> {1}%",
				en: "<a:blackCheck:803603780666523699> | **Volume changed**\n> {1}%"
			},
			volume_info: {
				fr: "<a:blackCheck:803603780666523699> | **Volume {1}%**",
				en: "<a:blackCheck:803603780666523699> | **Volume {1}%**"
			}
		}
	}
};