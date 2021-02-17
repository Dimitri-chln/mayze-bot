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
				fr: "Vérification avant changement",
				en: "Verification before editing"
			},
			verification_desc: {
				fr: "• Voici à quoi ressembleront les salons après modification. Veux-tu continuer ?",
				en: "• Here's how the channels will look like after editing. Continue?"
			},
			error_msg_too_long: {
				fr: "Le message est trop long pour que je puisse l'envoyer :/",
				en: "The message is too long for me to send it :/"
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
				fr: "entre un nombre compris entre 1 et 100",
				en: "enter a number between 1 and 100"
			},
			error_fetching_msg: {
				fr: "Quelque chose s'est mal passé en récupérant les messages :/",
				en: "Something went wrong when fetching the messages :/"
			},
			error_deleting_msg: {
				fr: "Quelque chose s'est mal passé en supprimant les messages :/",
				en: "Something went wrong when deleting the messages :/"
			},
			deleted: {
				fr: "{1} message(s) supprimés",
				en: "{1} message(s) deleted"
			}
		},
		"language": {
			invalid_language: {
				fr: "Langues disponibles : {1}",
				en: "Available languages: {1}"
			},
			error_database: {
				fr: "Quelque chose s'est mal passé en accédant à la base de données :/",
				en: "Something went wrong when accessing the database :/"
			},
			language_updated: {
				fr: "Langue modifiée",
				en: "Language updated"
			}
		}
	}
};