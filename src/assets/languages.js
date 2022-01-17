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
			syntax: {
				fr: "erreur de syntaxe",
				en: "syntax error"
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
			},
			mudae: {
				fr: "Mudae n'est pas dans ce serveur",
				en: "Mudae isn't on this server"
			}
		},
		"level": {
			chat_title: {
				fr: "Niveau de chat textuel",
				en: "Text chat level"
			},
			chat_description: {
				fr: "• **Niveau : `{1}`** | **Rang : `#{2}`**\n**XP** {3} {4}/{5}",
				en: "• **Level: `{1}`** | **Rank: `#{2}`**\n**XP** {3} {4}/{5}"
			},
			voice_title: {
				fr: "Niveau de chat vocal",
				en: "Voice chat level"
			},
			voice_description: {
				fr: "• **Niveau : `{1}`** | **Rang : `#{2}`**\n**XP** {3} {4}/{5}",
				en: "• **Level: `{1}`** | **Rank: `#{2}`**\n**XP** {3} {4}/{5}"
			}
		},
		"mass-ping": {
			no_mention: {
				fr: "mentionne un utilisateur",
				en: "mention a user"
			},
			invalid_number: {
				fr: "le nombre doit être compris entre 1 et 1000",
				en: "the number must be between 1 and 1000"
			},
			invalid_number_msg: {
				fr: "le nombre doit être compris entre 1 et 100",
				en: "the number must be between 1 and 100"
			}
		},
		"mega-evolve": {
			pokemon_not_owned: {
				fr: "tu n'as pas ce pokémon",
				en: "you don't own this pokémon"
			},
			not_mega_evolvable: {
				fr: "ce pokémon n'a pas de méga évolution",
				en: "this pokémon doesn't have a mega evolution"
			},
			no_mega_gem: {
				fr: "tu ne possèdes pas la méga gemme **{1}**",
				en: "you don't own the **{1}** mega gem"
			},
			xy: {
				fr: "précise la valeur X ou Y pour ce pokémon",
				en: "specify an X or Y value for this pokémon"
			},
			evolving_title: {
				fr: "Méga évolution de {1}",
				en: "{1}'s mega evolution"
			},
			evolving: {
				fr: "**{1}** est en train d'évoluer...",
				en: "**{1}** is evolving..."
			},
			evolved: {
				fr: "**{1}** a évolué en **{2}** !",
				en: "**{1}** evolved into **{2}**!"
			},
			title: {
				fr: "Méga gemmes de {1}",
				en: "{1}'s mega gems"
			}
		},
		"meme": {
			invalid_image: {
				fr: "cette image n'existe pas, tu peux voir la liste de toutes les images avec la commande `{1}meme`",
				en: "this image doesn't exist, see the list of available images with `{1}meme`"
			},
			copy_link: {
				fr: "• Copier le ~slien~t({1})",
				en: "• Copy ~slink~t({1})"
			},
			image_list: {
				fr: "Liste de tous les memes disponibles :",
				en: "List of all available memes:"
			}
		},
		"message": {
			invalid_channel: {
				fr: "indique le salon dans lequel je dois envoyer le message",
				en: "please specify the channel where I need to send the message"
			},
			msg_sent: {
				fr: "message envoyé !",
				en: "message sent!"
			}
		},
		"mudae-notes": {
			note_added: {
				fr: "note ajoutée",
				en: "note added"
			},
			invalid_note: {
				fr: "cette note n'existe pas",
				en: "this note doesn't exist"
			},
			note_removed: {
				fr: "note retirée",
				en: "note removed"
			},
			title: {
				fr: "Notes de {1}",
				en: "{1}'s notes"
			},
			no_note: {
				fr: "*Aucune note*",
				en: "*No note*"
			}
		},
		"palette": {
			title: {
				fr: "Palettes de couleurs pour le canevas",
				en: "Color palettes for the canvas"
			},
			palette: {
				fr: "Palette : **{1}**",
				en: "Palette: **{1}**"
			}
		},
		"place-chain": {
			not_in_board: {
				fr: "tu n'es dans aucun canevas. Rejoins-en un avec la commande `*board join <canvas>`",
				en: "you aren't in any canvas. Join one with `*board join <canvas>`"	
			},
			invalid_coordinates: {
				fr: "les coordonnées sont invalides",
				en: "the coordinates are invalid"
			},
			placing: {
				fr: "En train de placer {1} `{2}` ...",
				en: "Placing {1} `{2}` ..."
			}
		},
		"place": {
			not_in_board: {
				fr: "tu n'es dans aucun canevas. Rejoins-en un avec la commande `*board join <canvas>`",
				en: "you aren't in any canvas. Join one with `*board join <canvas>`"	
			},
			invalid_coordinates: {
				fr: "les coordonnées sont invalides",
				en: "the coordinates are invalid"
			},
			invalid_color: {
				fr: "cette couleur n'existe pas. Tu peux voir la liste de toutes les couleurs grâce à la commande `*palette`",
				en: "this color doesn't exist. See the list of all colors with the `*palette` command"
			},
			pixel_placed: {
				fr: "Pixel placé avec succès",
				en: "Pixel successfully placed"
			}
		},
		"pokedex": {
			invalid_pokemon: {
				fr: "ce pokémon n'existe pas",
				en: "this pokémon doesn't exist"
			},
			fields: {
				fr: [ "Autres noms :", "Taille :", "Poids :", "Stats de base :", "Formes :", "Types :" ],
				en: [ "Alternative names:", "Height:", "Weight:", "Base stats:", "Forms:", "Types:" ]
			},
			stats: {
				fr: "**PV :** {1}\n**Attaque :** {2}\n**Défense :** {3}\n**Attaque Spé. :** {4}\n**Défense Spé. :** {5}\n**Vitesse :** {6}",
				en: "**HP:** {1}\n**Attack:** {2}\n**Defense:** {3}\n**Sp. Attack:** {4}\n**Sp. Defense:** {5}\n**Speed:** {6}"
			},
			no_pokemon: {
				fr: "*Aucun pokémon ne correspond à la recherche*",
				en: "*No pokémon matches the search*"
			},
			title: {
				fr: "Pokédex de {1}",
				en: "{1}'s pokédex"
			},
			description: {
				fr: "[1?<~dpokeball~d829026553395937291>:<~dblank~d829352737946730576>] **{2}#{3}**",
				en: "[1?<~dpokeball~d829026553395937291>:<~dblank~d829352737946730576>] **{2}#{3}**"
			}
		},
		"pokemon": {
			invalid_pokemon: {
				fr: "ce pokémon n'existe pas",
				en: "this pokémon doesn't exist"
			},
			pokemon_not_owned: {
				fr: "tu n'as pas ce pokémon",
				en: "you don't own this pokémon"
			},
			favorite_added: {
				fr: "favori ajouté",
				en: "favorite added"
			},
			favorite_removed: {
				fr: "favori retiré",
				en: "favorite removed"
			},
			nickname_too_long: {
				fr: "le nom ne doit pas dépasser 30 caractères",
				en: "the nickname can't be over 30 characters"
			},
			nickname_updated: {
				fr: "nom mis à jour",
				en: "nickname updated"
			},
			evoline_title: {
				fr: "Évolutions de {1}",
				en: "Evolution line of {1}"
			},
			title: {
				fr: "Pokémons de {1}",
				en: "{1}'s pokémons"
			},
			total: {
				fr: "{1} pokémon[2?s:] correspond[2?ent:] à la recherche",
				en: "{1} pokémon[2?s:] match[2?:es] the search"
			},
			no_pokemon: {
				fr: "*Aucun pokémon ne correspond à la recherche*",
				en: "*No pokémon matches the search*"
			},
			description: {
				fr: "**{1} [7?~s:]{2}[7?~t({7}):]**[7?~s:]{3}[7?~t({7}):] [4? - \"{4}\":] - {5} attrapé[6?s:]",
				en: "**{1} [7?~s:]{2}[7?~t({7}):]**[7?~s:]{3}[7?~t({7}):] [4? - \"{4}\":] - {5} caught"
			}
		},
		"poll": {
			yes_no: {
				fr: [ "oui", "non" ],
				en: [ "yes", "no" ]
			},
			too_many_answers: {
				fr: "le nombre de propositions ne peut pas dépasser 10",
				en: "the number of answers can't exceed 10"
			},
			single: {
				fr: " | Un seul vote",
				en: " | Only one vote"
			},
			voted: {
				fr: "**{1}** a voté `{2}`",
				en: "**{1}** voted `{2}`"
			}
		},
		"react-snipe": {
			no_reaction: {
				fr: "il n'y a aucune réaction à snipe dans ce salon",
				en: "there is no reaction to snipe in this channel"
			},
			description: {
				fr: "**{1}** ~sa réagi avec~t({2}) {3}",
				en: "**{1}** ~sreacted with~t({2}) {3}"
			}
		},
		"remind-me": {
			invalid_duration: {
				fr: "la durée est invalide (ex: 2d15h)",
				en: "the duration is invalid (e.g. 2d15h)"
			},
			created: {
				fr: "__Rappel dans {1} :__\n> {2}",
				en: "__I will remind you in {1}:__\n> {2}"
			},
			invalid_number: {
				fr: "le nombre doit être compris entre 1 et {1}",
				en: "the number must be between 1 and {1}"
			},
			removed: {
				fr: "rappel retiré",
				en: "reminder removed"
			},
			title: {
				fr: "Rappels de {1}",
				en: "{1}'s reminders"
			},
			no_reminder: {
				fr: "*Aucun rappel*",
				en: "*No reminder*"
			}
		},
		"role-all": {
			invalid_role: {
				fr: "ce rôle n'existe pas",
				en: "this role doesn't exist"
			},
			response: {
				fr: "Le rôle {1} sera [2?ajouté à:retiré de] tous les [3?bots:][4?utilisateurs:][5?membres:]. Veux-tu continuer ?",
				en: "The role {1} will be [2?given to:removed from] all [3?bots:][4?human users:][5?members]. Do you want to continue?"
			},
			cancelled: {
				fr: "Procédure annulée",
				en: "Operation cancelled"
			},
			updating: {
				fr: "Mise à jour de {1} membre[2?s:]...",
				en: "Updating {1} member[2?s:]..."
			},
			updated: {
				fr: "[1?Aucun membre n'a:][2?1 membre a:][3?{4} membres ont:] été mis à jour ({5} erreur[6?s:])",
				en: "[1?No member:][2?1 member:][3?{4} members:] have been updated ({5} error[6?s:])"
			}
		},
		"role-color": {
			invalid_role: {
				fr: "ce rôle n'existe pas",
				en: "this role doesn't exist"
			},
			invalid_color: {
				fr: "la couleur est invalide (#xxyyzz)",
				en: "the color is invalid (#xxyyzz)"
			},
			title: {
				fr: "Couleur modifiée avec succès",
				en: "Color changed successfully"
			},
			changed: {
				fr: "La couleur du rôle {1} a été changée en `{2}`",
				en: "The color of the {1} role has been changed to `{2}`"
			}
		},
		"role": {
			invalid_role: {
				fr: "je n'ai pas réussi à trouver ce rôle",
				en: "I couldn't find this role"
			},
			description: {
				fr: "**ID :** `{1}`\n**Couleur** (dec) **:** `{2}`\n**Couleur** (hex) **:** `#{3}`\n**Position :** `{4}`\n**Membres :** `{5}`\n```\n{6}\n```",
				en: "**ID:** `{1}`\n**Color** (dec)**:** `{2}`\n**Color** (hex)**:** `#{3}`\n**Position:** `{4}`\n**Members:** `{5}`\n```\n{6}\n```"
			}
		},
		"shop": {
			title: {
				fr: "Magasin d'améliorations",
				en: "Upgrades shop"
			},
			balance: {
				fr: "Argent : ✨{1}",
				en: "Money: ✨{1}"
			},
			catch_cooldown_reduction: {
				fr: "Réduction du temps d'attente pour attraper un pokémon",
				en: "Catch cooldown reduction"
			},
			probability: {
				fr: "de chance",
				en: "probability"
			},
			new_pokemon_probability: {
				fr: "Nouveau pokémon",
				en: "New pokémon"
			},
			legendary_ub_probability: {
				fr: "Pokémon légendaire ou une chimère",
				en: "Legendary pokémon or an ultra beast"
			},
			mega_gem_probability: {
				fr: "Méga gemme",
				en: "Mega gem"
			},
			shiny_probability: {
				fr: "Pokémon shiny",
				en: "Shiny pokémon"
			},
			tier: {
				fr: "**Palier {1} :**",
				en: "**Tier {1}:**"
			},
			next_tier: {
				fr: "Palier suivant :",
				en: "Next tier:"
			},
			invalid_upgrade: {
				fr: "amélioration invalide",
				en: "invalid upgrade"
			},
			not_enough_money: {
				fr: "tu n'as pas assez d'argent pour acheter ce palier",
				en: "you don't have enough money to buy this tier"
			},
			max_tier_reached: {
				fr: "tu as déjà atteint le dernier palier pour cette amélioration",
				en: "you already reached the last tier for this upgrade"
			},
			new_tier: {
				fr: "tu as atteint le palier **{1}** pour **✨{2}**",
				en: "you reached tier **{1}** for **✨{2}**"
			}
		},
		"since": {
			invalid_date: {
				fr: "le format de la date est incorrect (mm-dd-yyyy [hh:mm:ss])",
				en: "the date format is invalid (mm-dd-yy [hh:mm:ss])"
			},
			already_passed: {
				fr: "la date doit déjà être dépassée",
				en: "the date must be already passed"
			},
			months: {
				fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
				en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			},
			midnight: {
				fr: "minuit",
				en: "midnight"
			},
			date_string: {
				fr: "{2} {1} {3} à {4}",
				en: "{1}, {2}[5?st:][6?nd:][7?rd:][8?th:] {3} at {4}"
			},
			response: {
				fr: "Il s'est écoulé {1} depuis le {2}",
				en: "{1} have passed since {2}"
			}
		},
		"slots": {
			title: {
				fr: "Partie de casino",
				en: "Slots game"
			},
			kick: {
				fr: "Tu as été kick pour avoir perdu au casino",
				en: "You have been kicked for losing a slots game"
			},
			kick_reason: {
				fr: "a perdu au casino",
				en: "lost a slots game"
			},
			jail_in_jail: {
				fr: "dommage <:sepince:750285894853984308>",
				en: "nope <:sepince:750285894853984308>"
			},
			massping: {
				fr: "mentionne une personne à spam ping",
				en: "mention a user to spam ping"
			},
			mute: {
				fr: "mentionne une personne à mute",
				en: "mention a user to mute"
			},
			too_late: {
				fr: "Le temps est écoulé 💤",
				en: "Time is up 💤"
			}
		},
		"snipe": {
			no_snipe: {
				fr: "il n'y a aucun message à snipe dans ce salon",
				en: "there is no message to snipe in this channel"
			},
			other_images: {
				fr: "Autres images",
				en: "Other images"
			}
		},
		"stats": {
			invalid_pokemon: {
				fr: "ce pokémon n'existe pas",
				en: "this pokémon doesn't exist"
			},
			normal: {
				fr: "**Normaux :** `{1}`\n",
				en: "**Normal:** `{1}`\n"
			},
			shiny: {
				fr: "**Shinies :** `{1}`\n",
				en: "**Shinies:** `{1}`\n"
			},
			legendary: {
				fr: "**Légendaires :** `{1}`\n",
				en: "**Legendaries:** `{1}`\n"
			},
			legendary_shiny: {
				fr: "**Légendaires shiny :** `{1}`\n",
				en: "**Shiny legendaries:** `{1}`\n"
			},
			beast: {
				fr: "**Chimères :** `{1}`\n",
				en: "**Ultra beasts:** `{1}`\n"
			},
			beast_shiny: {
				fr: "**Chimères shiny :** `{1}`\n",
				en: "**Shiny ultra beasts:** `{1}`\n"
			},
			alolan: {
				fr: "**Alolan :** `{1}`\n",
				en: "**Alolan:** `{1}`\n"
			},
			alolan_shiny: {
				fr: "**Alolan shiny :** `{1}`\n",
				en: "**Shiny alolan:** `{1}`\n"
			},
			mega: {
				fr: "**Mégas :** `{1}`\n",
				en: "**Megas:** `{1}`\n"
			},
			mega_shiny: {
				fr: "**Mégas shiny :** `{1}`\n",
				en: "**Shiny megas:** `{1}`\n"
			},
			total: {
				fr: "> __**Total :**__ `{1}`",
				en: "> __**Total:**__ `{1}`"
			},
			title: {
				fr: "Statistiques de Mayze",
				en: "Mayze's statistics"
			},
			no_pokemon: {
				fr: "*Aucun pokémon ne correspond à la recherche*",
				en: "*No pokémon matches the search*"
			},
			most_caught_title: {
				fr: "Pokémons les plus attrapés",
				en: "Most caught pokémons"
			},
			most_caught: {
				fr: "`{1}.` **{2}** - {3} attrapés",
				en: "`{1}.` **{2}** - {3} caught"
			}
		},
		"top": {
			title: {
				fr: "Classement [2?textuel:vocal] de {1}",
				en: "{1}'s [2?chat:voice] leaderboard"
			},
			no_member: {
				fr: "*Aucun membre n'est encore classé*",
				en: "*No member is ranked for now*"
			},
			description: {
				fr: "`{1}.` **{2}** - **Niveau `{3}`**",
				en: "`{1}.` **{2}** - **Level `{3}`**"
			}
		},
		"trade": {
			invalid_user: {
				fr: "mentionne un utilisateur",
				en: "mention a user"
			},
			same_user: {
				fr: "mentionne un autre utilisateur que toi",
				en: "mention another user than you"
			},
			blocked: {
				fr: "**{1}** a été bloqué[2? pendant {2}:]",
				en: "**{1}** has been blocked[2? for {2}:]"
			},
			unblocked: {
				fr: "**{1}** a été débloqué",
				en: "**{1}** has been unblocked"
			},
			not_allowed: {
				fr: "tu ne peux pas échanger avec **{1}**",
				en: "you cannot trade with **{1}**"
			},
			empty_trade: {
				fr: "l'échange ne doit pas être vide",
				en: "the trade must not be empty"
			},
			invalid_pkm: {
				fr: "**`{1}`** n'est pas un pokémon\n",
				en: "**`{1}`** is not a pokémon\n"
			},
			title: {
				fr: "Échange entre {1} et {2}",
				en: "Trade between {1} and {2}"
			},
			offer: {
				fr: "{1} offre :",
				en: "{1} offers:"
			},
			demand: {
				fr: "Est demandé à {1} :",
				en: "{1} is asked for:"
			},
			footer: {
				fr: " | Réagis avec ✅ ou ❌ pour accepter ou refuser l'échange",
				en: " | React with ✅ or ❌ to accept or deny the trade"
			},
			not_enough_pkm: {
				fr: "→ Il manque {2} à **{1}** pour cet échange\n",
				en: "→ **{1}** is missing {2} for this trade\n"
			},
			fav_pokemon: {
				fr: "→ **{1}** ne peut pas donner {2} car ce[3?s:] pokémon[3?s:] [3?sont:est] dans ses favoris\n",
				en: "→ **{1}** can't give {2} because [3?these:this] pokémon[3?s:] [3?are:is] in their favorites\n"
			},
			cancelled: {
				fr: "Échange [1?annulé par **{1}**:expiré]",
				en: "Trade [1?cancelled by **{1}**:expired]"
			},
			trade_complete: {
				fr: "Échange validé",
				en: "Trade completed"
			}
		},
		"trivia": {
			start_msg_title: {
				fr: "Une partie de trivia va commencer...",
				en: "Trivia game starting..."
			},
			score_limit: {
				fr: "Le premier à {1} points gagne",
				en: "First to reach {1} points wins"
			},
			start_msg_description: {
				fr: "Réagis avec ✅ pour jouer",
				en: "React with ✅ to play"
			},
			no_player: {
				fr: "il n'y a pas assez de joueurs (2 minimum)",
				en: "there aren't enough players (need at least 2)"
			},
			question: {
				fr: "Question n°{1}",
				en: "Question #{1}"
			},
			whats_this_pkm: {
				fr: "Quel est ce pokémon ?",
				en: "Who's this pokémon?"
			},
			bonus_language: {
				fr: " | Langue bonus : {1}",
				en: " | Bonus language: {1}"
			},
			answer: {
				fr: "__**Réponses :**__\n**{1}**",
				en: "__**Answers:**__\n**{1}**"
			},
			inactive: {
				fr: "La partie a été annulée pour inactivité",
				en: "The game has been cancelled due to inactivity"
			},
			winner_msg_title: {
				fr: "Nous avons un gagnant !",
				en: "We have a winner!"
			},
			no_correct_answer: {
				fr: "__**Aucune bonne réponse**__\n{1}",
				en: "__**No correct answer**__\n{1}"
			}
		},
		"until": {
			invalid_date: {
				fr: "le format de la date est incorrect (mm-dd-yyyy [hh:mm:ss])",
				en: "the date format is invalid (mm-dd-yy [hh:mm:ss])"
			},
			not_passed: {
				fr: "la date ne doit pas être dépassée",
				en: "the date must not be passed"
			},
			months: {
				fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
				en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			},
			midnight: {
				fr: "minuit",
				en: "midnight"
			},
			date_string: {
				fr: "{2} {1} {3} à {4}",
				en: "{1}, {2}[5?st:][6?nd:][7?rd:][8?th:] {3} at {4}"
			},
			response: {
				fr: "Il reste {1} avant le {2}",
				en: "{1} remaining until {2}"
			}
		},
		"uptime": {
			response: {
				fr: "Je suis en ligne depuis {1} !",
				en: "I have been online for {1}!"
			}
		},
		"view": {
			not_in_board: {
				fr: "tu n'es dans aucun canevas. Rejoins-en un avec la commande `*board join <canvas>`",
				en: "you aren't in any canvas. Join one with `*board join <canvas>`"	
			},
			invalid_coordinates: {
				fr: "les coordonnées sont invalides",
				en: "the coordinates are invalid"
			},
			invalid_zoom: {
				fr: "le zoom est trop grand",
				en: "the zoom is too big"
			},
			title: {
				fr: "{1} ({2}x{2}) | {3}s pour charger l'image",
				en: "{1} ({2}x{2}) | Image took {3}s to load"
			}
		},
		"view-nav": {
			not_in_board: {
				fr: "tu n'es dans aucun canevas. Rejoins-en un avec la commande `*board join <canvas>`",
				en: "you aren't in any canvas. Join one with `*board join <canvas>`"	
			},
			invalid_coordinates: {
				fr: "les coordonnées sont invalides",
				en: "the coordinates are invalid"
			},
			nav: {
				fr: "Navigation dans le canevas {1}",
				en: "Navigation in the {1} canvas"
			}
		},
		"wish": {
			invalid_series: {
				fr: "le nom de la série est invalide",
				en: "the series' name is invalid"
			},
			added: {
				fr: "wish ajouté",
				en: "wish added"
			}
		},
		"wish-list": {
			no_wish: {
				fr: "*Aucun souhait trouvé*",
				en: "*No wish*"
			},
			title: {
				fr: "Wishlist de {1}",
				en: "{1}'s wishlist"
			}
		},
		"wish-remove": {
			removed: {
				fr: "wish retiré",
				en: "wish removed"
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