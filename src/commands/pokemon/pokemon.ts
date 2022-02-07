import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import { DatabasePokemon } from "../../types/structures/Database";
import pagination, { Page } from "../../utils/misc/pagination";
import PokemonList from "../../types/pokemon/PokemonList";
import escapeMarkdown from "../../utils/misc/espapeMarkdown";



const command: Command = {
	name: "pokemon",
	description: {
		fr: "Obtenir la liste des pokémons que tu as attrapés",
		en: "Get the list of all the pokémons you caught"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "addfav",
				description: "Ajouter un pokémon à tes favoris",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à ajouter",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "removefav",
				description: "Retirer un pokémon de tes favoris",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à retirer",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "nick",
				description: "Modifier le surnom d'un de tes pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à renommer",
						type: "STRING",
						required: true
					},
					{
						name: "nickname",
						description: "Le nouveau surnom du pokémon. Laisse vide pour le réinitialiser",
						type: "STRING",
						required: false
					}
				]
			},
			{
				name: "evoline",
				description: "Obtenir la ligne d'évolutions d'un pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon dont tu veux obtenir la ligne d'évolutions",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Obtenir la liste de tes pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur dont tu veux obtenir la liste",
						type: "USER",
						required: false
					},
					{
						name: "normal",
						description: "Une option pour n'afficher que les pokémons normaux",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "favorite",
						description: "Une option pour n'afficher que tes pokémons favoris",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "legendary",
						description: "Une option pour n'afficher que les pokémons légendaires",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "ultra-beast",
						description: "Une option pour n'afficher que les chimères",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "shiny",
						description: "Une option pour n'afficher que les pokémons shiny",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "alola",
						description: "Une option pour n'afficher que les pokémons d'Alola",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "mega",
						description: "Une option pour n'afficher que les méga pokémons",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "id",
						description: "Une option pour trouver un pokémon grâce à son ID. Pour afficher les ID à côté des pokémons, utiliser la valeur 0",
						type: "INTEGER",
						required: false
					},
					{
						name: "name",
						description: "Une option pour trouver un pokémon grâce à son nom ou surnom",
						type: "STRING",
						required: false
					},
					{
						name: "evolution",
						description: "Une option pour trouver la ligne d'évolutions complète d'un pokémon",
						type: "STRING",
						required: false
					}
				]
			}
		],
		en: [
			{
				name: "addfav",
				description: "Add a pokémon to your favorites",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to add",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "removefav",
				description: "Remove a pokémon from your favorites",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to remove",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "nick",
				description: "Change the nickname of one of your pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to rename",
						type: "STRING",
						required: true
					},
					{
						name: "nickname",
						description: "The new nickname of the pokémon. Leave blank to reset",
						type: "STRING",
						required: false
					}
				]
			},
			{
				name: "evoline",
				description: "Get the evolution line of a pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon whose evolution line to get",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Get the list of your pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user whose pokémons to check",
						type: "USER",
						required: false
					},
					{
						name: "normal",
						description: "An option to display normal pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "favorite",
						description: "An option to display your favorite pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "legendary",
						description: "An option to display legendary pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "ultra-beast",
						description: "An option to display ultra beasts only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "shiny",
						description: "An option to display shiny pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "alola",
						description: "An option to display alolan pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "mega",
						description: "An option to display mega pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "id",
						description: "An option to find a pokémon by its ID. To display IDs next to the pokémons instead, use the value 0",
						type: "INTEGER",
						required: false
					},
					{
						name: "name",
						description: "An option to find a pokémon by its name or nickname",
						type: "STRING",
						required: false
					},
					{
						name: "evolution",
						description: "An option to show the whole evolution line of a pokémon",
						type: "STRING",
						required: false
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();
		
		switch (subCommand) {
			case "addfav": {
				const { pokemon, shiny, variationType } = Pokedex.findByNameWithVariation(
					interaction.options.getString("pokemon")
				) ?? {};
				
				if (!pokemon) return interaction.reply({
					content: translations.data.invalid_pokemon(),
					ephemeral: true
				});
				
				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[ pokemon.nationalId, shiny, variationType, interaction.user.id ]
				);
				
				if (!pokemons.length) return interaction.reply({
					content: translations.data.pokemon_not_owned(),
					ephemeral: true
				});

				await Util.database.query(
					`
					UPDATE pokemons SET users = jsonb_set(users, '{${interaction.user.id}, favorite}', TRUE::text::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[ pokemon.nationalId, shiny, variationType ]
				);
				
				interaction.reply({
					content: translations.data.favorite_added(pokemon.formatName(shiny, variationType, translations.language)),
					ephemeral: true
				});
				break;
			}
			
			case "removefav": {
				const { pokemon, shiny, variationType } = Pokedex.findByNameWithVariation(
					interaction.options.getString("pokemon")
				) ?? {};
				
				if (!pokemon) return interaction.reply({
					content: translations.data.invalid_pokemon(),
					ephemeral: true
				});
				
				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[ pokemon.nationalId, shiny, variationType, interaction.user.id ]
				);
				
				if (!pokemons.length) return interaction.reply({
					content: translations.data.pokemon_not_owned(),
					ephemeral: true
				});

				await Util.database.query(
					`
					UPDATE pokemons SET users = jsonb_set(users, '{${interaction.user.id}, favorite}', FALSE::text::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[ pokemon.nationalId, shiny, variationType ]
				);
				
				interaction.reply({
					content: translations.data.favorite_removed(pokemon.formatName(shiny, variationType, translations.language)),
					ephemeral: true
				});
				break;
			}
			
			case "nick": {
				const { pokemon, shiny, variationType } = Pokedex.findByNameWithVariation(
					interaction.options.getString("pokemon")
				) ?? {};
				
				if (!pokemon) return interaction.reply({
					content: translations.data.invalid_pokemon(),
					ephemeral: true
				});

				const nickname = interaction.options.getString("nickname");
				if (nickname && nickname.length > 30) return interaction.reply({
					content: translations.data.nickname_too_long()
				});
				
				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[ pokemon.nationalId, shiny, variationType, interaction.user.id ]
				);
				
				if (!pokemons.length) return interaction.reply({
					content: translations.data.pokemon_not_owned(),
					ephemeral: true
				});

				await Util.database.query(
					`
					UPDATE pokemons SET users = jsonb_set(users, '{${interaction.user.id}, nickname}', $4::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[ pokemon.nationalId, shiny, variationType, nickname ]
				);
				
				interaction.reply({
					content: translations.data.nickname_updated(
						pokemon.formatName(shiny, variationType, translations.language),
						nickname
					),
					ephemeral: true
				});
				break;
			}

			case "evoline": {
				const pokemon = Pokedex.findByName(interaction.options.getString("pokemon"));

				if (!pokemon) return interaction.reply({
					content: translations.data.invalid_pokemon(),
					ephemeral: true
				});

				const stringEvolutionLine = pokemon.stringEvolutionLine(translations.language);

				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.evoline_title(pokemon.names[translations.language] ?? pokemon.names.en),
								iconURL: interaction.client.user.displayAvatarURL()
							},
							thumbnail: {
								url: `https://assets.poketwo.net/images/${pokemon.nationalId}.png?v=26`
							},
							color: interaction.guild.me.displayColor,
							description: `\`\`\`\n${stringEvolutionLine}\n\`\`\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}
			
			case "list": {
				const user = interaction.options.getUser("user") ?? interaction.user;

				const { rows: pokemons }: { rows: DatabasePokemon[] }  = await Util.database.query(
					"SELECT * FROM pokemons WHERE users ? $1 ORDER BY legendary DESC, ultra_beast DESC, shiny DESC, (users -> $1 -> 'caught')::int DESC, pokedex_id ASC",
					[ user.id ]
				);

				const pokemonList = new PokemonList(
					pokemons.filter(pkm => {
						if (interaction.options.getBoolean("normal") && (pkm.shiny || pkm.variation !== "default")) return false;
						if (interaction.options.getBoolean("favorite") && !pkm.users[user.id].favorite) return false;
						if (interaction.options.getBoolean("legendary") && !Pokedex.findById(pkm.pokedex_id).legendary) return false;
						if (interaction.options.getBoolean("ultra-beast") && !Pokedex.findById(pkm.pokedex_id).ultraBeast) return false;
						if (interaction.options.getBoolean("shiny") && !pkm.shiny) return false;
						if (interaction.options.getBoolean("alola") && pkm.variation !== "alola") return false;
						if (interaction.options.getBoolean("mega") && !["mega", "megax", "megay", "primal"].includes(pkm.variation)) return false;
						
						if (
							interaction.options.getInteger("id") &&
							interaction.options.getInteger("id") !== 0 &&
							pkm.pokedex_id !== interaction.options.getInteger("id")
						) return false;
						
						if (
							interaction.options.getString("name") &&
							!new RegExp(interaction.options.getString("name"), "i").test(Pokedex.findById(pkm.pokedex_id).names[translations.language]) &&
							!new RegExp(interaction.options.getString("name"), "i").test(pkm.users[user.id].nickname)
						) return false;

						if (
							interaction.options.getString("evolution") &&
							Pokedex.findByName(interaction.options.getString("evolution")) &&
							!Pokedex.findByName(interaction.options.getString("evolution")).flatEvolutionLine().some(p => p.nationalId === pkm.pokedex_id)
						) return false;

						return true;
					}),
					user.id
				);

				const pages: Page[] = [];
				const page: Page = {
					embeds: [
						{
							author: {
								name: translations.data.title(user.tag),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							description: translations.data.no_pokemon()
						}
					]
				};
				if (!pokemonList.pokemons.length) pages.push(page);

				const total = pokemons.reduce((sum, p) => sum + p.users[user.id].caught, 0);
				
				for (let i = 0; i < pokemonList.pokemons.length; i += Util.config.ITEMS_PER_PAGE) {
					page.embeds[0] = {
						author: {
							name: translations.data.title(user.tag),
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						},
						title: translations.data.total(total.toString(), total > 1),
						color: interaction.guild.me.displayColor,
						description: pokemonList.pokemons
							.slice(i, i + Util.config.ITEMS_PER_PAGE)
							.map(p => translations.data.description(
								p.data.formatName(p.shiny, p.variation, translations.language, "badge"),
								p.data.formatName(p.shiny, p.variation, translations.language, "raw"),
								interaction.options.getInteger("id") === 0 ? `#${p.data.nationalId.toString().padStart(3, "0")}` : "",
								escapeMarkdown(p.nickname),
								p.caught.toString(),
								p.caught > 1,
								p.favorite ? `https~d//www.pokemon.com/${translations.language === "en" ? "us" : translations.language}/pokedex/${p.data.names[translations.language].toLowerCase().replace(/[:\.']/g, "").replace(/\s/g, "-").replace(/\u2642/, "-male").replace(/\u2640/, "-female")}` : ""
							)).join("\n")
					};
						
					if (pokemonList.pokemons.length === 1)
						page.embeds[0].thumbnail.url = pokemonList.pokemons[0].data.image(pokemonList.pokemons[0].shiny, pokemonList.pokemons[0].variation);
					
					pages.push(page);
				};
				
				pagination(interaction, pages);
				break;
			}
		}
	}
};



export default command;