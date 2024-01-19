const translations: AllTranslations = {
	"commands": {
		"8-ball": {
			"data": {
				"reply": ["**Question:** {1}\\n**Answer:** {2}", "**Question :** {1}\\n**Réponse :** {2}"],
				"answers": ['["Yes", "No", "Certainly", "Obviously", "For sure", "Always", "Without a doubt", "Probably", "Not at all", "Perhaps", "Never", "That\'s possible", "I don\'t think so", "Probably not", "Obviously not", "I don\'t know", "Not sure"]', '["Oui", "Non", "Certainement", "Évidemment", "Bien-sûr", "Toujours", "Sans hésiter", "Probablement", "Pas du tout", "Peut-être", "Jamais", "C\'est possible", "Je ne pense pas", "Probablement pas", "bien-sûr que non", "Je ne sais pas", "Pas sûr"]'],
			},
			"options": {
				"question": {
					"description": ["The question to ask", "La question à poser"],
					"name": ["question", "question"],
				},
			},
			"description": ["Ask Mayze about something", "Demander quelque chose à Mayze"],
			"name": ["8-ball", "8-ball"],
		},
		"mudae": {
			"subcommandgroups": {
				"wish": {
					"name": ["wish", "souhait"],
					"description": ["Manage your Mudae wishes", "Gérer tes souhaits Mudae"],
					"subcommands": {
						"list": {
							"name": ["list", "liste"],
							"description": ["View the list of your Mudae wishes", "Voir la liste de tes souhaits Mudae"],
							"options": {
								"user": {
									"name": ["user", "utilisateur"],
									"description": ["The user whose Mudae wishes you want to view", "L'utilisateur dont tu veux voir les souhaits Mudae"],
								},
								"regex": {
									"name": ["regex", "regex"],
									"description": ["Display the regex next to the series' name", "Afficher le regex à côté du nom des séries"],
								},
							},
						},
						"add": {
							"name": ["add", "ajouter"],
							"description": ["Add a wish to your Mudae wishes", "Ajouter un souhait à tes souhaits Mudae"],
							"options": {
								"series": {
									"name": ["series", "série"],
									"description": ["The name of the series", "Le nom de la série"],
								},
								"regex": {
									"name": ["regex", "regex"],
									"description": ["A regex to help match alternative names", "Un regex pour aider à faire correspondre les noms alternatifs"],
								},
							},
						},
						"remove": {
							"name": ["remove", "retirer"],
							"description": ["Remove a wish from your Mudae wishes", "Retirer un souhait de tes souhaits Mudae"],
							"options": {
								"series": {
									"name": ["series", "série"],
									"description": ["The name of the series to remove", "Le nom de la série à retirer"],
								},
							},
						},
					},
				},
			},
			"name": ["mudae", "mudae"],
			"description": ["Utility commands for Mudae", "Commandes utilitaires pour Mudae"],
			"data": {
				"mudae-missing": ["Mudae isn't on this server", "Mudae n'est pas sur ce serveur"],
				"removed": ["Wish removed", "Souhait retiré"],
				"no-wish": ["No wish found", "Aucun souhait trouvé"],
				"author": ["{1}'s wishes", "Souhaits de {1}"],
				"added": ["Wish added", "Souhait ajouté"],
			},
		},
		"afk": {
			"data": {
				"reply": ["{1} is now AFK 💤[2?\\n**→ {2}**:]", "{1} est maintenant AFK 💤[2?\\n**→ {2}**:]"],
			},
			"description": ["Set an AFK status", "Ajouter un statut AFK"],
			"name": ["afk", "afk"],
			"options": {
				"message": {
					"description": ["The message to send when you are mentionned", "Le message à envoyer lorsque tu es mentionné"],
					"name": ["message", "message"],
				},
			},
		},
		"canvas": {
			"subcommands": {
				"join": {
					"description": ["Join a canvas", "Rejoindre un canevas"],
					"name": ["join", "rejoindre"],
					"options": {
						"canvas": {
							"description": ["The name of the canvas", "Le nom du canevas"],
							"name": ["canvas", "canevas"],
						},
					},
					"data": {
						"joined": ["Joined canvas `{1}`", "Canevas `{1}` rejoint"],
						"invalid-canvas": ["The given canvas name is invalid", "Le nom du canevas entré est invalide"],
					},
				},
				"list": {
					"name": ["list", "liste"],
					"description": ["Get the list of all available canvases", "Obtenir la liste de tous les canevas disponibles"],
					"data": {
						"author": ["Canvas list", "Liste des canevas"],
					},
				},
				"palettes": {
					"name": ["palettes", "palettes"],
					"description": ["View the available colour palettes", "View the available color palettes", "Voir les palettes de couleurs disponibles"],
					"data": {
						"title": ["Palette: **{1}**", "Palette : **{1}**"],
						"author": ["Available color palettes", "Palettes de couleurs disponibles"],
					},
				},
				"place": {
					"name": ["place", "placer"],
					"description": ["Place a pixel on the canvas", "Placer un pixel sur le canevas"],
					"options": {
						"x": {
							"name": ["x", "x"],
							"description": ["The x coordinate of the pixel", "L'abscisse du pixel"],
						},
						"y": {
							"name": ["y", "y"],
							"description": ["The y coordinate of the pixel", "L'ordonnée du pixel"],
						},
						"color": {
							"name": ["colour", "color", "couleur"],
							"description": ["The colour of the pixel", "The color of the pixel", "La couleur du pixel"],
						},
					},
					"data": {
						"invalid-color": ["This color doesn't exist. View the list of all available colors with the `/canvas palettes` command", "Cette couleur n'existe pas. Tu peux voir la liste de toutes les couleurs disponibles grâce à la commande `/canevas palettes`"],
						"placed": ["Pixel successfully placed", "Pixel placé avec succès"],
					},
				},
				"navigation": {
					"description": ["Navigate in the canvas pixel by pixel", "Naviguer dans le canevas pixel par pixel"],
					"options": {
						"x": {
							"name": ["x", "x"],
							"description": ["The x coordinate of the pixel", "L'abscisse du pixel"],
						},
						"y": {
							"name": ["y", "y"],
							"description": ["The y coordinate of the pixel", "L'ordonnée du pixel"],
						},
					},
					"name": ["navigation", "navigation"],
				},
				"place-chain": {
					"name": ["place-chain", "placer-chaîne"],
					"description": ["Place several pixels on the canvas", "Placer plusieurs pixels sur le canevas"],
					"options": {
						"x": {
							"description": ["The x coordinate of the pixel", "L'abscisse du pixel"],
							"name": ["x", "x"],
						},
						"y": {
							"description": ["The y coordinate of the pixel", "L'ordonnée du pixel"],
							"name": ["y", "y"],
						},
					},
					"data": {
						"palette-placeholder": ["Pick a color palette", "Choisis une palette de couleurs"],
						"color-placeholder": ["Pick a color", "Choisis une couleur"],
					},
				},
				"view": {
					"name": ["view", "voir"],
					"description": ["View an image of the canvas", "Voir une image du canevas"],
					"options": {
						"x": {
							"name": ["x", "x"],
							"description": ["The x coordinate of the pixel in the upper-left corner of the image", "L'abscisse du pixel au coin supérieur gauche de l'image"],
						},
						"y": {
							"name": ["y", "y"],
							"description": ["The y coordinate of the pixel in the upper-left corner of the image", "L'ordonnée du pixel au coin supérieur gauche de l'image"],
						},
						"zoom": {
							"name": ["zoom", "zoom"],
							"description": ["The size of the image in pixels", "La taille de l'image en pixels"],
						},
					},
					"data": {
						"author": ["{1} ({2}×{2}) | Image loaded in {3}s", "{1} ({2}×{2}) | Image chargée en {3}s"],
						"invalid-zoom": ["The given zoom is invalid", "Le zoom entré est invalide"],
					},
				},
			},
			"description": ["Draw on a canvas", "Dessiner sur un canevas"],
			"name": ["canvas", "canevas"],
			"data": {
				"invalid-coordinates": ["The given coordinates are invalid", "Les coordonnées entrées sont invalides"],
				"no-canvas": ["You aren't in any canvas. Join one with the `/canvas join` command", "Tu n'es dans aucun canevas. Rejoins-en un avec la commande `/canevas rejoindre`"],
			},
		},
		"avatar": {
			"data": {
				"author": ["{1}'s profile picture", "Photo de profil de {1}"],
			},
			"description": ["View your profile picture or someone else's", "Voir ta photo de profil ou celle de quelqu'un d'autre"],
			"name": ["avatar", "avatar"],
			"options": {
				"user": {
					"name": ["user", "utilisateur"],
					"description": ["A user whose profile picture you want to see", "Un utilisateur dont tu veux voir la photo de profil"],
				},
			},
		},
		"banner": {
			"data": {
				"author": ["{1}'s banner", "Bannière de {1}"],
			},
			"description": ["View your banner or someone else's", "Voir ta bannière ou celle de quelqu'un d'autre"],
			"name": ["banner", "bannière"],
			"options": {
				"user": {
					"description": ["A user whose banner you want to see", "Un utilisateur dont tu veux voir la bannière"],
					"name": ["user", "utilisateur"],
				},
			},
		},
		"backup": {
			"options": {
				"table": {
					"name": ["table", "table"],
					"description": ["The database table to backup", "La table de la base de données à sauvegarder"],
				},
			},
			"name": ["backup", "backup"],
			"description": ["Create a backup of a database table", "Créer une sauvegarde d'une table de la base de données"],
		},
		"balance": {
			"data": {
				"description": ["**✨ Money:** `{1}`\\n**Daily available:** [2?<t~d{2}~dR>:Now]", "**✨ Argent :** `{1}`\\n**Daily disponible :** [2?<t~d{2}~dR>:Maintenant]"],
				"author": ["{1}'s balance", "Balance de {1}"],
			},
			"description": ["View how much money you have", "Voir combien d'argent que tu possèdes"],
			"name": ["balance", "solde"],
			"options": {
				"user": {
					"description": ["A user whose balance you want to see", "Un utilisateur dont tu veux voir l'argent"],
					"name": ["user", "utilisateur"],
				},
			},
		},
		"clear-queue": {
			"description": ["Delete all songs from the queue", "Supprimer toutes les musiques de la queue"],
			"data": {
				"cleared": ["<a:blackCheck:803603780666523699> | **Queue cleared**", "<a:blackCheck:803603780666523699> | **Queue supprimée**"],
			},
			"name": ["clear-queue", "supprimer-queue"],
		},
		"kick": {
			"options": {
				"reason": {
					"description": ["The reason for expulsion", "La raison de l'expulsion"],
					"name": ["reason", "raison"],
				},
				"user": {
					"name": ["user", "utilisateur"],
					"description": ["The user to kick", "L'utilisateur à expulser"],
				},
			},
			"name": ["kick", "expulser"],
			"description": ["Kick a member from the server", "Expulser un membre du serveur"],
			"data": {
				"not-allowed": ["You are not allowed to kick this user", "Tu ne peux pas expulser cet utilisateur"],
				"boost": ["**{1}** is boosting the server", "**{1}** booste le serveur"],
				"too-high": ["I am not high enough in the hierarchy to kick **{1}**", "Je ne suis pas assez haut dans la hiérarchie pour expulser **{1}**"],
				"reason": ["Kicked by {1}[2?. Reason~d {2}:]", "Expulsé par {1}[2?. Raison ~d {2}:]"],
				"kicked": ["**{1}** has been kicked", "**{1}** a été expulsé"],
			},
		},
		"catch": {
			"data": {
				"mega-gem": ["\\n+ *__Bonus:__ **{1}***", "\\n+ *__Bonus :__ **{1}***"],
				"hunt": ["Additional probability to get a[1?n:] {2}: {3}%", "Probabilité supplémentaire d'avoir un {2} : {3}%"],
				"new": ["🔸 New pokémon!", "🔸 Nouveau pokémon !"],
				"title": ["{1} caught a[2?n:] {3}! (+ **✨{4}**)", "{1} a attrapé un {3} ! (+ **✨{4}**)"],
				"caught": ["Pokémon caught!", "Pokémon capturé !"],
			},
			"description": ["Catch a pokémon!", "Attrape un pokémon !"],
			"name": ["catch", "attraper"],
		},
		"clear": {
			"data": {
				"cleared": ["{1} message[2?s:] deleted", "{1} message[2?s:] supprimé[2?s:]"],
				"invalid-number": ["The number of messages must be between 1 and 100", "Le nombre de messages doit être compris entre 1 et 100"],
			},
			"description": ["Delete messages from the current channel", "Supprimer des messages du salon actuel"],
			"name": ["clear", "supprimer"],
			"options": {
				"bot": {
					"description": ["Only delete messages sent by bots", "Ne supprimer que les messages envoyés par des bots"],
					"name": ["bot", "bot"],
				},
				"number": {
					"description": ["The number of messages to delete", "Le nombre de messages à supprimer"],
					"name": ["number", "nombre"],
				},
				"pattern": {
					"name": ["pattern", "motif"],
					"description": ["Only delete messages matching the given regular expression", "Ne supprimer que les messages qui correspondent à l'expression régulière donnée"],
				},
				"user": {
					"description": ["Only delete messages sent by the given user", "Ne supprimer que les messages envoyés par l'utilisateur donné"],
					"name": ["user", "utilisateur"],
				},
			},
		},
		"clear-duplicates": {
			"data": {
				"cleared": ["<a:blackCheck:803603780666523699> | **{1} song[2?s:] removed**", "<a:blackCheck:803603780666523699> | **{1} musique[2?s:] supprimée[2?s:]**"],
			},
			"description": ["Delete the duplicate songs from the queue", "Supprimer les musiques en double de la queue"],
			"name": ["clear-duplicates", "supprimer-doublons"],
		},
		"cron": {
			"data": {
				"date-passed": ["The given date has already passed", "La date entrée est déjà passée"],
				"invalid-date": ["The given date is invalid (format: `mm-dd-yy hh:mm:ss`)", "La date entrée est invalide (format : `mm-jj-aaaa hh:mm:ss`)"],
				"scheduled": ["Task scheduled", "Tâche programmée"],
			},
			"name": ["cron", "cron"],
			"description": ["Schedule a Cron task", "Programmer une tâche Cron"],
			"options": {
				"date": {
					"name": ["date", "date"],
					"description": ["The task's cronTime parameter", "Le paramètre cronTime de la tâche"],
				},
				"task": {
					"name": ["task", "tâche"],
					"description": ["The task to schedule", "La tâche à programmer"],
				},
			},
		},
		"custom-response": {
			"name": ["custom-response", "réponse-personnalisée"],
			"description": ["Manage custom responses", "Gérer les réponses personnalisées"],
			"subcommands": {
				"list": {
					"name": ["list", "liste"],
					"description": ["View the list of all custom responses", "Voir la liste de toutes les réponses personnalisées"],
					"data": {
						"author": ["Custom responses", "Réponses personnalisées"],
						"trigger-types": ['{ 1: "Contains", 2: "Equal to", 3: "Matches", 4: "Starts with", 5: "Ends with" }', '{ 1: "Contient", 2: "Égal à", 3: "Correspond à", 4: "Commence par", 5: "Finit par" }'],
					},
				},
				"add": {
					"name": ["add", "ajouter"],
					"options": {
						"trigger": {
							"name": ["trigger", "déclencheur"],
							"description": ["The text which triggers the response", "Le texte qui déclenche la réponse"],
						},
						"response": {
							"name": ["response", "réponse"],
							"description": ["The response to send", "La réponse à envoyer"],
						},
						"type": {
							"name": ["type", "type"],
							"description": ["The type of the trigger", "Le type du déclencheur"],
							"choices": {
								"contains": ["Contains", "Contient"],
								"equals": ["Equal to", "Égal à"],
								"pattern": ["Pattern", "Motif"],
								"start": ["Starts with", "Commence par"],
								"end": ["Ends with", "Finit par"],
							},
						},
					},
					"description": ["Add a new custom response", "Ajouter une nouvelle réponse personnalisée"],
					"data": {
						"added": ["Custom response added", "Réponse personnalisée ajoutée"],
					},
				},
				"remove": {
					"name": ["remove", "retirer"],
					"description": ["Remove an existing custom response", "Retirer une réponse personnalisée existante"],
					"options": {
						"response": {
							"name": ["response", "réponse"],
							"description": ["The custom response's number", "Le numéro de la réponse personnalisée"],
						},
					},
					"data": {
						"invalid-number": ["The custom response's number must be between 1 and {1}", "Le numéro de la réponse personnalisée doit être compris entre 1 et {1}"],
						"removed": ["Custom response removed", "Réponse personnalisée retirée"],
					},
				},
			},
		},
		"hunt": {
			"options": {
				"pokemon": {
					"description": ['The pokémon to hunt (use "none" to reset)', 'Le pokémon à chasser (utilise "none" pour réinitialiser)'],
					"name": ["pokémon", "pokémon"],
				},
			},
			"name": ["hunt", "chasse"],
			"description": ["Hunt a pokémon", "Chasser un pokémon"],
			"data": {
				"info": ["You are currently hunting **{1}** with an additional probability of **{2}%**", "Tu es en train de chasser **{1}** avec une probabilité supplémentaire de **{2}%**"],
				"not-hunting": ["You are not hunting any pokémon", "Tu ne chasses aucun pokémon"],
				"stopped-hunting": ["You are not hunting a pokémon anymore", "Tu ne chasses plus de pokémon"],
				"invalid-pokemon": ["This pokémon doesn't exist", "Ce pokémon n'existe pas"],
				"confirmation": ["Changing the pokémon to hunt will restart the current chain. Start hunting **{1}**?", "Changer de pokémon à chasser va réinitialiser la chaîne actuelle. Commencer à chasser **{1}** ?"],
				"hunting": ["You are now hunting **{1}**", "Tu chasses désormais **{1}**"],
				"cancelled": ["Change cancelled", "Changement annulé"],
			},
		},
		"define": {
			"name": ["define", "définition"],
			"description": ["Find the definition of a word", "Trouver la définition d'un mot"],
			"options": {
				"word": {
					"name": ["word", "mot"],
					"description": ["The word to search", "Le mot à chercher"],
				},
			},
			"data": {
				"synonyms": ["Synonyms: {1}", "Synonymes : {1}"],
				"invalid-word": ["This word doesn't exist, or it isn't spelled correctly", "Ce mot n'existe pas, ou il est mal orthographié"],
			},
		},
		"gift": {
			"name": ["gift", "cadeau"],
			"description": ["Send someone a random gift", "Envoyer un cadeau aléatoire à quelqu'un"],
			"options": {
				"user": {
					"name": ["user", "utilisateur"],
					"description": ["The user to send a gift to", "L'utilisateur à qui envoyer un cadeau"],
				},
			},
			"data": {
				"reply": ["> 🎁 {1}, you received __**{2}**__ from **{3}**", "> 🎁 {1}, tu as reçu __**{2}**__ de la part de **{3}**"],
			},
		},
		"help": {
			"name": ["help", "aide"],
			"description": ["View the list of all commands or get help on a command", "Voir la liste de toutes les commandes ou obtiens de l'aide sur une commande"],
			"options": {
				"command": {
					"name": ["command", "commande"],
					"description": ["A command to get help on", "Une commande pour laquelle obtenir de l'aide"],
				},
			},
			"data": {
				"list-author": ["List of available commands", "Liste des commandes disponibles"],
				"invalid-command": ["This command doesn't exist", "Cette commande n'existe pas"],
				"author": ["Help for /{1}", "Aide pour /{1}"],
				"description": ["**Name:** `{1}`\\n**Category:** {2}\\n**Description:** {3}\\n**Permissions:** `{4}`\\n**Cooldown:** {5}", "**Nom :** `{1}`\\n**Catégorie :** {2}\\n**Description :** {3}\\n**Permissions :** `{4}`\\n**Cooldown :** {5}"],
			},
		},
		"daily": {
			"data": {
				"description": ["You just got **✨{1}** - Total: **✨{2}**", "Tu as obtenu **✨{1}** - Total : **✨{2}**"],
				"author": ["Daily reward", "Récompense quotidienne"],
				"cooldown": ["You can claim your next reward in **{1}**", "Tu peux récupérer ta prochaine récompense dans **{1}**"],
			},
			"description": ["Claim your daily reward", "Réclamer ta récompense quotidienne"],
			"name": ["daily", "quotidien"],
		},
		"eval": {
			"data": {
				"error": ["__**Error :**__\\n```\\n{1}\\n```", "__**Erreur :**__\\n```\\n{1}\\n```"],
				"executing": ["Executing the command...", "Éxecution de la commande..."],
			},
			"description": ["Evaluate an expression", "Évaluer une expression"],
			"name": ["eval", "eval"],
			"options": {
				"expression": {
					"name": ["expression", "expression"],
					"description": ["The expression to evaluate", "L'expression à évaluer"],
				},
			},
		},
		"image": {
			"name": ["image", "image"],
			"description": ["Generate and manipulate images", "Gérer et manipuler des images"],
			"subcommands": {
				"overlay": {
					"name": ["overlay", "overlay"],
					"description": ["Add an overlay to your profile picture", "Ajouter un overlay à ta photo de profil"],
					"options": {
						"type": {
							"name": ["type", "type"],
							"description": ["The type of overlay to add to your profile picture", "Le type d'overlay à ajouter à ta photo de profil"],
						},
					},
					"data": {
						"invalid-type": ["This overlay doesn't exist", "Cet overlay n'existe pas"],
					},
				},
			},
		},
		"jail": {
			"name": ["jail", "prison"],
			"description": ["Put a member in jail or free them", "Mettre un membre en prison ou le libérer"],
			"options": {
				"user": {
					"name": ["user", "utilisateur"],
					"description": ["The user to put in jail or to free", "L'utilisateur à mettre en prison ou à libérer"],
				},
			},
			"data": {
				"not-allowed": ["You are not allowed to put this member in jail", "Tu ne peux pas mettre ce membre en prison"],
				"in-jail": ["**{1}** has been put in jail", "**{1}** a été mis en prison"],
				"freed": ["**{1}** has been freed", "**{1}** a été libéré"],
			},
		},
		"kick-myself": {
			"name": ["kick-myself", "adieu"],
			"data": {
				"boost": ["You cannot be kicked because you are boosting this server", "Tu ne peux pas être expulsé(e) car tu boost ce serveur"],
				"too-high": ["I am not high enough in the hierarchy to kick you", "Je ne suis pas assez haut dans la hiérarchie pour t'expulser"],
				"reason": ["Kicked themselves", "S'est expulsé(e) lui/elle-même"],
				"kicked": ["**{1}** evaded their responsabilities", "**{1}** a fui ses responsabilités"],
			},
			"description": ["Kick yourself from the server", "S'expulser soi-même du serveur"],
		},
		"info": {
			"description": ["View some information about the bot", "Voir quelques informations sur le bot"],
			"data": {
				"title": ["Information about the bot", "Informations sur le bot"],
				"description": ["**Owner:** `{1}`\\n**Online since :** <t:{2}:R>", "Propriétaire :** `{1}`\\n**En ligne depuis :** <t:{2}:R>"],
			},
			"name": ["info", "info"],
		},
		"language": {
			"name": ["language", "langue"],
			"description": ["Change the language of the bot in this server", "Changer la langue du bot dans ce serveur"],
			"options": {
				"language": {
					"name": ["language", "langue"],
					"description": ["The new language", "La nouvelle langue"],
					"autocomplete": {
						"da": ["Danish", "Danois"],
						"de": ["German", "Allemand"],
						"en-US": ["English, US", "Anglais, US"],
						"es-ES": ["Spanish", "Espagnol"],
						"fr": ["French", "Français"],
						"hr": ["Croatian", "Croate"],
						"it": ["Italian", "Italien"],
						"lt": ["Lithuanian", "Lituanien"],
						"hu": ["Hungarian", "Hongrois"],
						"nl": ["Dutch", "Néerlandais"],
						"no": ["Norwegian", "Norvégien"],
						"pl": ["Polish", "Polonais"],
						"ro": ["Romanian, Romania", "Roumain, Roumanie"],
						"fi": ["Finnish", "Finnois"],
						"sv-SE": ["Swedish", "Suédois"],
						"vi": ["Vietnamese", "Vietnamien"],
						"tr": ["Turkish", "Turc"],
						"cs": ["Czech", "Tchèque"],
						"el": ["Greek", "Grec"],
						"bg": ["Bulgarian", "Bulgare"],
						"ru": ["Russian", "Russe"],
						"uk": ["Ukrainian", "Ukrainien"],
						"hi": ["Hindi", "Hindi"],
						"zh-CN": ["Chinese, China", "Chinois, Chine"],
						"ja": ["Japanese", "Japonais"],
						"zh-TW": ["Chinese, Taiwan", "Chinois, Taiwan"],
						"ko": ["Korean", "Coréen"],
						"en-GB": ["English, GB", "Anglais, GB"],
						"pt-BR": ["Portuguese, Brazil", "Portugais, Brésil"],
					},
				},
			},
			"data": {
				"changed": ["The language has been changed successully", "La langue a été modifée avec succès"],
			},
		},
		"lapse-of-time": {
			"description": ["See how much time there is between now and another date", "Voir combien de temps il y a entre maintenant et une autre date"],
			"name": ["lapse-of-time", "laps-de-temps"],
			"options": {
				"date": {
					"description": ["The date", "La date"],
					"name": ["date", "date"],
				},
			},
			"data": {
				"response": ["{2} [1?have passed since:are remaining until] **{4} {3}[9?st:[10?nd:[11?rd:th]]] {5}** at **{6}:{7}:{8}**", "Il [1?s'est écoulé:reste] {2} [1?depuis:avant] le **{3} {4} {5}** à **{6}:{7}:{8}**"],
				"invalid-date": ["The date format is invalid (dd-mm-yy [hh:mm:ss])", "Le format de la date est incorrect (jj-mm-aaaa [hh:mm:ss])"],
				"month-list": ['["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]', '["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]'],
			},
		},
		"math": {
			"data": {
				"syntax-error": ["Error:\\n```\\n{1}\\n```", "Erreur :\\n```\\n{1}\\n```"],
				"no-solution": ["No solution", "Pas de solution"],
			},
			"description": ["Perform mathematical calculations", "Effectuer des calculs mathématiques"],
			"name": ["math", "math"],
			"subcommands": {
				"derivative": {
					"description": ["Find the derivative of an expression", "Trouver la dérivée d'une expression"],
					"name": ["derivative", "dérivée"],
					"options": {
						"expression": {
							"description": ["The expression to derive", "L'expression à dériver"],
							"name": ["expression", "expression"],
						},
						"variable": {
							"name": ["variable", "variable"],
							"description": ["The variable with respect to which to derive the expression", "La variable par rapport à laquelle dériver l'expression"],
						},
					},
				},
				"evaluate": {
					"description": ["Evaluate an expression", "Évaluer une expression"],
					"name": ["evaluate", "évaluer"],
					"options": {
						"expression": {
							"description": ["The expression to evaluate", "L'expression à évaluer"],
							"name": ["expression", "expression"],
						},
					},
				},
				"solve": {
					"name": ["solve", "résoudre"],
					"description": ["Solve an algebric equation", "Résoudre une équation algébrique"],
					"options": {
						"equation": {
							"description": ["The equation to solve", "L'équation à résoudre"],
							"name": ["equation", "équation"],
						},
						"variable": {
							"description": ["The variable to solve for", "La variable à déterminer"],
							"name": ["variable", "variable"],
						},
					},
				},
			},
		},
		"loop": {
			"name": ["loop", "boucle"],
			"description": ["Toggle the repeat of the current song", "Basculer la répétition de la musique actuelle"],
			"data": {
				"toggled": ["<a:blackCheck:803603780666523699> | **Song repeat [1?enabled:disabled]**", "<a:blackCheck:803603780666523699> | **Répétition de la musique [1?activée:désactivée]**"],
			},
		},
		"lyrics": {
			"name": ["lyrics", "paroles"],
			"description": ["View the lyrics of a song", "Voir les paroles d'une chanson"],
			"options": {
				"song": {
					"name": ["song", "chanson"],
					"description": ["The name of a song to search", "Le nom d'une chanson à chercher"],
				},
				"artist": {
					"name": ["artist", "artiste"],
					"description": ["The name of the song's artist", "Le nom de l'artiste de la chanson"],
				},
			},
			"data": {
				"no-song": ["Please enter a song name", "Indique le nom d'une chanson"],
				"no-lyrics": ["I couldn't find any lyrics for this song", "Je n'ai pas trouvé de paroles pour cette chanson"],
				"author": ['Lyrics of "{1} - {2}"', 'Paroles de "{1} - {2}"'],
			},
		},
		"spam-ping": {
			"data": {
				"sending": ["Sending the messages...", "Envoi des messages..."],
				"sent": ["Messages sent", "Messages envoyés"],
				"invalid-number": ["The number must be between 1 and 100", "Le nombre doit être compris entre 1 et 100"],
			},
			"options": {
				"message": {
					"description": ["A message to add to each ping", "Un message à ajouter à chaque mention"],
					"name": ["message", "message"],
				},
				"user": {
					"description": ["The user to ping", "L'utilisateur à mentionner"],
					"name": ["user", "utilisateur"],
				},
				"number": {
					"name": ["number", "nombre"],
					"description": ["The number of pings to send", "Le nombre de mentions à envoyer"],
				},
			},
			"description": ["Ping a user repeatedly", "Mentionner un utilisateur en boucle"],
			"name": ["spam-ping", "spam-ping"],
		},
		"level": {
			"data": {
				"text-title": ["Text chat level", "Niveau de chat textuel"],
				"voice-level": ["Voice chat level", "Niveau de chat vocal"],
				"description": ["• **Level: `{1}`** | **Rank: `#{2}`**\\n**XP** {3} {4}/{5}", "• **Niveau : `{1}`** | **Rang : `#{2}`**\\n**XP** {3} {4}/{5}"],
			},
			"description": ["View your text and voice chat level with Mayze", "Voir ton niveau de chat textuel et vocal avec Mayze"],
			"options": {
				"user": {
					"description": ["A user whose level you want to see\n", "Un utilisateur dont tu veux voir le niveau"],
					"name": ["user", "utilisateur"],
				},
			},
			"name": ["level", "niveau"],
		},
		"mega": {
			"name": ["mega", "mega"],
			"description": ["Manage your mega gems", "Gérer tes méga gemmes"],
			"subcommands": {
				"evolve": {
					"name": ["evolve", "évoluer"],
					"description": ["Mega evolve a pokémon", "Faire méga évoluer un pokémon"],
					"options": {
						"pokemon": {
							"name": ["pokémon", "pokémon"],
							"description": ["The pokémon to mega evolve", "Le pokémon à faire méga évoluer"],
						},
						"type": {
							"name": ["type", "type"],
							"description": ["The mega evolution type", "Le type de méga évolution"],
							"choices": {
								"default": ["Mega", "Méga"],
								"megax": ["Mega X", "Méga X"],
								"megay": ["Mega Y", "Méga Y"],
								"primal": ["Primal", "Primal"],
							},
						},
					},
				},
				"gems": {
					"name": ["gems", "gemmes"],
					"description": ["View all your mega gems", "Voir toutes tes méga gemmes"],
				},
			},
			"data": {
				"invalid-pokemon": ["This pokémon doesn't exist", "Ce pokémon n'existe pas"],
				"pokemon-not-owned": ["You don't own this pokémon", "Tu n'as pas ce pokémon"],
				"invalid-mega-evolution": ["This pokémon doesn't have this type of mega evolution", "Ce pokémon n'a pas ce type de méga evolution"],
				"no-mega-gem": ["You don't own the **{1}** mega gem", "Tu ne possèdes pas la méga gemme **{1}**"],
				"evolving-author": ["{1}'s mega evolution", "Méga évolution de {1}"],
				"evolving": ["**{1}** is evolving...", "**{1}** est en train d'évoluer..."],
				"list-author": ["{1}'s mega gems", "Méga gemmes de {1}"],
				"evolved": ["**{1}** has evolved into **{2}**!", "**{1}** a évolué en **{2}** !"],
			},
		},
		"move": {
			"options": {
				"after": {
					"name": ["after", "après"],
					"description": ["Move the song after...", "Déplacer la musique après..."],
				},
				"song": {
					"description": ["The song to move", "La musique à déplacer"],
					"name": ["song", "musique"],
				},
			},
			"description": ["Move a song in the queue", "Déplacer une musique dans la queue"],
			"name": ["move", "déplacer"],
			"data": {
				"invalid-song": ["The song number must be between 1 and {1}", "Le numéro de la musique doit être compris entre 1 et {1}"],
				"invalid-position": ["The position must be between 1 and {1}", "La position doit être compris entre 1 et {1}"],
				"moved": ["<a:blackCheck:803603780666523699> | **Song moved**\\n> {1}", "<a:blackCheck:803603780666523699> | **Musique déplacée**\\n> {1}"],
			},
		},
		"now-playing": {
			"name": ["now-playing", "en-cours"],
			"description": ["View the currently playing song", "Voir la musique en cours de lecture"],
			"data": {
				"loading": ["Creating the song display message...", "Création du message d'affichage de la musique..."],
			},
		},
		"pause": {
			"name": ["pause", "pause"],
			"description": ["Pause the current song", "Mettre en pause la musique actuelle"],
			"data": {
				"paused": ["<a:blackCheck:803603780666523699> | **Paused**", "<a:blackCheck:803603780666523699> | **Mis en pause**"],
			},
		},
		"ping": {
			"name": ["ping", "ping"],
			"description": ["Pong!", "Pong !"],
		},
		"play": {
			"name": ["play", "jouer"],
			"description": ["Play a song or a playlist in a voice channel", "Jouer une musique ou playlist dans un salon vocal"],
			"options": {
				"song": {
					"name": ["song", "musique"],
					"description": ["The song or playlist to play", "La musique ou playlist à jouer"],
				},
				"shuffle": {
					"name": ["shuffle", "mélanger"],
					"description": ["In case of a playlist, shuffle it before playing it", "Dans le cas d'une playlist, la mélanger avant de la jouer"],
				},
			},
			"data": {
				"playing": ["<a:blackCheck:803603780666523699> | **Added to the queue • Played [1?in {2}:now]**\n> {3}", "<a:blackCheck:803603780666523699> | **Ajouté à la queue • Joué [1?dans {2}:maintenant]**\n> {3}"],
				"playlist": ["<a:blackCheck:803603780666523699> | **Playlist added[2? and shuffled:]**\n> {1} songs have been added to the queue", "<a:blackCheck:803603780666523699> | **Playlist ajoutée[2? et mélangée:]**\n> {1} musiques ont été ajoutées à la queue"],
				"invalid-song": ["This type of link is not supported", "Ce type de lien n'est pas supporté"],
			},
		},
		"playlist": {
			"name": ["playlist", "playlist"],
			"description": ["Save and play playlists", "Sauvegarder et jouer des playlists"],
			"subcommands": {
				"list": {
					"name": ["list", "liste"],
					"description": ["View the list of available playlists", "Voir la liste des playlists disponibles"],
					"options": {
						"me": {
							"name": ["me", "moi"],
							"description": ["Show your playlists only", "Ne montrer que tes playlists"],
						},
					},
					"data": {
						"author": ["{1}'s playlists", "Playlists de {1}"],
						"no_playlist": ["*No playlist*", "*Pas de playlist*"],
						"footer_private": [" | 🚫 means that the playlist is private", " | 🚫 signifie que la playlist est privée"],
					},
				},
				"play": {
					"name": ["play", "jouer"],
					"description": ["Play a saved playlist", "Jouer une playlist sauvegardée"],
					"options": {
						"name": {
							"name": ["name", "nom"],
							"description": ["The name of the playlist to play", "Le nom de la playlist à jouer"],
						},
						"shuffle": {
							"name": ["shuffle", "mélanger"],
							"description": ["Shuffle the playlist before playing it", "Mélanger la playlist avant de la jouer"],
						},
					},
					"data": {
						"invalid_name": ["The playlist's name can only conatain letters, numbers, - and _", "Le nom de la playlist ne peut contenir que des lettres, chiffres, - et _"],
						"not_in_vc": ["You aren't in the same voice channel as me", "Tu n'es pas dans le même salon vocal que moi"],
						"invalid_playlist": ["There is no playlist with this name or it's private", "Il n'y a pas de playlist avec ce nom ou elle est privée"],
						"playlist": ["<a:blackCheck:803603780666523699> | **Playlist added[2? and shuffled:]**\n> {1} songs have been added to the queue", "<a:blackCheck:803603780666523699> | **Playlist ajoutée[2? et mélangée:]**\n> {1} musiques ont été ajoutées à la queue"],
					},
				},
				"add": {
					"name": ["add", "ajouter"],
					"description": ["Save a new playlist", "Sauvegarder une nouvelle playlist"],
					"options": {
						"name": {
							"name": ["name", "nom"],
							"description": ["The name to give to the playlist", "Le nom à donner à la playlist"],
						},
						"url": {
							"name": ["url", "url"],
							"description": ["The link to the playlist", "Le lien de la playlist"],
						},
						"private": {
							"name": ["private", "privé"],
							"description": ["Save the playlist privately", "Sauvegarder la playlist en privé"],
						},
					},
					"data": {
						"invalid_name": ["The playlist's name can only conatain letters, numbers, - and _", "Le nom de la playlist ne peut contenir que des lettres, chiffres, - et _"],
						"playlist_already_exists": ["A playlist with this name already exists", "Une playlist avec ce nom existe déjà"],
						"invalid_url": ["The link is invalid", "Le lien est invalide"],
						"playlist_created": ["<a:blackCheck:803603780666523699> | **Playlist created**", "<a:blackCheck:803603780666523699> | **Playlist créée**"],
					},
				},
				"remove": {
					"name": ["remove", "retirer"],
					"description": ["Remove a saved playlist", "Retirer une playlist sauvegardée"],
					"options": {
						"name": {
							"name": ["name", "nom"],
							"description": ["The name of the playlist to remove", "Le nom de la playlist à retirer"],
						},
					},
					"data": {
						"invalid_name": ["The playlist's name can only conatain letters, numbers, - and _", "Le nom de la playlist ne peut contenir que des lettres, chiffres, - et _"],
						"invalid_playlist": ["There is no playlist with this name or it's private", "Il n'y a pas de playlist avec ce nom ou elle est privée"],
						"not_allowed": ["You aren't allowed to delete this playlist", "Tu ne peux pas supprimer cette playlist"],
						"playlist_deleted": ["<a:blackCheck:803603780666523699> | **Playlist deleted**", "<a:blackCheck:803603780666523699> | **Playlist supprimée**"],
					},
				},
			},
		},
	},
};
