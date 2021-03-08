module.exports = {
	get: (text, ...args) => text.replace(/\{\d+\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1]),
	data: {
		unauthorized_guild: {
			fr: "cette commande ne fonctionne pas sur ce serveur",
			en: "this command isn't available on this server"
		},
		unauthorized_perms: {
			fr: "tu n'as pas les permissions nécessaires\n → `{1}`",
			en: "you don't have enough permissions\n → `{1}`"
		},
		wrong_usage: {
			fr: "Utilisation : `{1}`",
			en: "Usage: `{1}`"
		},
		cooldown: {
			fr: "attends encore **{1}** avant d'utiliser la commande `{2}`",
			en: "wait **{1}** before using the `{2}` command"
		},
		error: {
			fr: "Quelque chose s'est mal passé en exécutant la commande :/",
			en: "Something went wrong when running the command :/"
		},
		errors: {
			database: {
				fr: "Quelque chose s'est mal passé en accédant à la base de données :/",
				en: "Something went wrong when accessing the database :/"
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
			sending: {
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
			}
		},
		"afk": {
			afk_message: {
				fr: "{1} est maintenant AFK 💤{2}",
				en: "{1} is now AFK 💤{2}"
			}
		},
		"among-us": {
			default_desc: {
				fr: "Partie classique",
				en: "Normal game"
			},
			invalid_code: {
				fr: "entre un code valide",
				en: "enter a valid code"
			},
			game_added: {
				fr: "partie ajoutée !",
				en: "game added!"
			},
			user_no_ongoing: {
				fr: "tu n'as pas de partie en cours",
				en: "you don't have any ongoing game"
			},
			game_deleted: {
				fr: "partie supprimée !",
				en: "game deleted!"
			},
			ongoing_games: {
				fr: "Parties Among Us en cours",
				en: "Ongoing Among Us games"
			},
			time_ago: {
				fr: "il y a {1}",
				en: "{1} ago"
			},
			no_ongoing: {
				fr: "*Aucune partie en cours*",
				en: "*No ongoing game*"
			}
		},
		"avatar": {
			invalid_user: {
				fr: "cet utilisateur n'existe pas",
				en: "this user doesn't exist"
			},
			title: {
				fr: "Photo de profil de {1}",
				en: "{1}'s profile picture"
			}
		},
		"catch": {
			caught: {
				fr: "Pokémon capturé !",
				en: "Pokemon caught!"
			},
			caught_new: {
				fr: "Nouveau pokémon ! 🎗️",
				en: "New pokémon! 🎗️"
			},
			caught_title: {
				fr: "{1} a attrapé un {2} !",
				en: "{1} caught a {2}!"
			}
		},
		"channel-names": {
			verification_title: {
				fr: "Avant changement...",
				en: "Before editing..."
			},
			verification_desc: {
				fr: "Voici à quoi ressembleront les salons après modification. Veux-tu continuer ?",
				en: "Here's how the channels will look like after editing. Continue?"
			},
			cancelled: {
				fr: "Procédure annulée",
				en: "Operation cancelled"
			},
			editing: {
				fr: "Modification de {1} salons...",
				en: "Editing {1} channels..."
			},
			done_editing: {
				fr: "{1} salons ont été modifiés ! ({2} erreur(s))",
				en: "{2} channels have been edited! ({2} error(s))"
			}
		},
		"clear": {
			invalid_number: {
				fr: "le nombre doit être compris entre 1 et 100",
				en: "the number must be between 1 and 100"
			},
			deleted: {
				fr: "{1} message(s) supprimés",
				en: "{1} message(s) deleted"
			}
		},
		"color": {
			selector: {
				fr: "Sélecteur de couleur",
				en: "Color selector"
			},
			desc: {
				fr: "**Hexadécimal :** `{1}`\n**RGB :** 🟥 `{2}` 🟩 `{3}` 🟦 `{4}`\n**Décimal :** `{5}`",
				en: "**Hexadecimal:** `{1}`\n**RGB:** 🟥 `{2}` 🟩 `{3}` 🟦 `{4}`\n**Decimal:** `{5}`"
			}
		},
		"custom-response": {
			not_enough_args: {
				fr: "pas assez d'arguments",
				en: "not enough arguments"
			},
			response_added: {
				fr: "Réponse ajoutée",
				en: "Response added"
			},
			invalid_number: {
				fr: "le numéro doit être compris entre 1 et {1}",
				ed: "the number must be between 1 and {1}"
			},
			response_removed: {
				fr: "Réponse retirée",
				en: "Response removed"
			},
			trigger_types: {
				fr: ["Contient", "Égal à", "Correspond à", "Commence par", "Finit par"],
				en: ["Contains", "Equal to", "Matches", "Starts with", "Ends with"]
			},
			embed_title: {
				fr: "Réponses personnalisées",
				en: "Custom responses"
			},
			invalid_args: {
				fr: "arguments incorrects",
				en: "invalid arguments"
			}
		},
		"edit-snipe": {
			no_message: {
				fr: "il n'y a pas de message à snipe dans ce salon",
				en: "there is nothing to snipe in this channel"
			}
		},
		"help": {
			commands_list: {
				fr: "Liste des commandes",
				en: "List of commands"
			},
			invalid_command: {
				fr: "cette commande n'existe pas",
				en: "this command doesn't exist"
			},
			name: {
				fr: "**Nom :** `{1}`",
				en: "**Name:** `{1}`"
			},
			aliases: {
				fr: "\n**Aliases :** `{1}`",
				en: "\n**Aliases:** `{1}`"
			},
			description: {
				fr: "\n**Description :** {1}",
				en: "\n**Description:** {1}"
			},
			usage: {
				fr: "\n**Utilisation :** `{1} {2}`",
				en: "\n**Usage:** `{1} {2}`"
			},
			perms: {
				fr: "\n**Permissions :** `{1}`",
				en: "\n**Permissions:** `{1}`"
			},
			allowed: {
				fr: "\n**Utilisable par :** {1}",
				en: "\n**Authorized users:** {1}"
			},
			cooldown: {
				fr: "\n**Cooldown :** {1}",
				en: "\n**Cooldown:** {1}"
			},
			title: {
				fr: "Informations sur la commande {1}",
				en: "Help for {1}"
			}
		},
		"hug": {
			title: {
				fr: "{1} fait un câlin à {2} 🤗",
				en: "{1} gives {2} a hug 🤗"
			}
		},
		"info": {
			title: {
				fr: "• Informations sur le bot",
				en: "• Information about the bot"
			},
			description: {
				fr: "**Préfixe :** `{1}`\n**Propriétaire :** `{2}`\n**Version :** `{3}`",
				en: "**Prefix:** `{1}`\n**Owner:** `{2}`\n**Version:** `{3}`"
			},
			unknown: {
				fr: "**Inconnu**",
				en: "**Unknown**"
			}
		},
		"kick-myself": {
			reason: {
				fr: "s'est kick lui/elle-même",
				en: "kicked themselves"
			},
			kick_msg: {
				fr: "**{1}** a fui ses responsabilités",
				en: "**{1}** evaded his responsabilities"
			},
		},
		"kiss": {
			title: {
				fr: "{1} fait un bisous à {2} 😘",
				en: "{1} kisses {2} 😘"
			}
		},
		"language": {
			invalid_language: {
				fr: "langues disponibles : `{1}`",
				en: "available languages: `{1}`"
			},
			language_updated: {
				fr: "Langue modifiée",
				en: "Language updated"
			}
		},
		"level": {
			description: {
				fr: "• **Niveau : `{1}`**\n• **Rang : `#{2}`**\n\n**XP** {3} {4}/{5}",
				en: "• **Level: `{1}`**\n• **Rank: `{2}`**\n\n**XP** {3} {4}/{5}"
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
		"meme": {
			invalid_image: {
				fr: "cette image n'existe pas, tu peux voir la liste de toutes les images avec la commande `{1}meme`",
				en: "this image doesn't exist, see the list of available images with `{1}meme`"
			},
			copy_link: {
				fr: "• Copier le [lien]({1})",
				en: "• Copy [link]({1})"
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
			},
			invalid_args: {
				fr: "arguments invalides",
				en: "invalid arguments"
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
				fr: "**PV:** {1}\n**Attaque:** {2}\n**Défense:** {3}\n**Attaque Spé:** {4}\n**Défense Spé:** {5}\n**Vitesse:** {6}",
				en: "**HP:** {1}\n**Attack:** {2}\n**Defense:** {3}\n**Sp. Attack:** {4}\n**Sp. Defense:** {5}\n**Speed:** {6}"
			}
		},
		"pokemon": {
			title: {
				fr: "Pokémons de {1}",
				en: "{1}'s pokémons"
			},
			no_pokemon: {
				fr: "*Aucun pokémon ne correspond à la recherche*",
				en: "*No pokémon matches the search*"
			},
			description: {
				fr: "**{1}{2}{3}**{4} - {5} attrapé{6}",
				en: "**{1}{2}{3}**{4} - {5} caught"
			}
		}
	}
};