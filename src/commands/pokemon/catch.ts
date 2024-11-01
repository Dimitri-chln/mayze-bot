import { CommandData } from "../../structures/commands/Command";
import { Locale, PermissionFlagsBits, PermissionsBitField, TextChannel } from "discord.js";
import Util from "../../Util";

import {
	DatabaseItem,
	DatabasePokemonHunting,
	DatabaseShop,
	DatabaseUserItem,
	DatabaseUserPokemon,
} from "../../types/Database";

import LocalizationItem from "../../structures/localizations/LocalizationItem";

import Pokemon, { NameFormat, VariationName, VariationTypeName } from "../../structures/pokemons/Pokemon";

const command: CommandData = {
	name: "catch",
	aliases: ["c"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),
	cooldown: 1_200,

	options: [],

	async run(input, args, localizations) {
		const { rows: caughtPokemonsData }: { rows: DatabaseUserPokemon[] } = await Util.database.query(
			"SELECT * FROM user_pokemon WHERE user_id = $1",
			[input.user.id],
		);

		const {
			rows: userUpgradesData,
		}: { rows: Pick<DatabaseItem & DatabaseShop & DatabaseUserItem, "name" | "quantity">[] } =
			await Util.database.query(
				`
				SELECT item.name, COALESCE(user_item.quantity, 0) AS quantity FROM item
				JOIN shop ON shop.id = item.shop_id
				LEFT JOIN (SELECT * FROM user_item WHERE user_id = $1) AS user_item ON user_item.item_id = item.id
				WHERE shop.name = 'pokemon'
				`,
				[input.user.id],
			);

		const userUpgrades = userUpgradesData.reduce((upgrades, upgrade) => {
			upgrades[upgrade.name] = upgrade.quantity;
			return upgrades;
		}, {} as UserUpgrades);

		// Catch rates
		const cumulativeProbabilities: { pokemon: Pokemon; cumulativeProbability: number }[] = [];
		let lastCumulativeProbability = 0;

		Util.pokedex.pokemons.forEach((pokemon) => {
			let probability = pokemon.catchRate;

			// Increased legendary and ultra beast probability: +2% per level
			if (pokemon.legendary || pokemon.ultraBeast)
				probability *= 1 + (userUpgrades.legendary_ultra_beast_probability * 2) / 100;

			// Increased new pokémon probability: +2% per level
			if (!caughtPokemonsData.some((caughtPokemon) => caughtPokemon.pokemon_id === pokemon.nationalId))
				probability *= 1 + (userUpgrades.new_pokemon_probability * 2) / 100;

			lastCumulativeProbability += probability;

			cumulativeProbabilities.push({
				pokemon: pokemon,
				cumulativeProbability: lastCumulativeProbability,
			});
		});

		// Find a random pokémon
		let randomPokemon: Pokemon;
		const randomNumber = Math.random() * lastCumulativeProbability;

		for (const cumulativeProbability of cumulativeProbabilities) {
			if (randomNumber < cumulativeProbability.cumulativeProbability) {
				randomPokemon = cumulativeProbability.pokemon;
				break;
			}
		}

		// Pokémon hunting
		let huntFooterText: string;

		const {
			rows: [pokemonHuntingData],
		}: { rows: Pick<DatabasePokemonHunting, "pokemon_id" | "hunt_count">[] } = await Util.database.query(
			"SELECT pokemon_id, hunt_count FROM pokemon_hunting WHERE user_id = $1",
			[input.user.id],
		);

		if (pokemonHuntingData) {
			const huntedPokemon = Util.pokedex.findById(pokemonHuntingData.pokemon_id);
			let probability = Math.min((pokemonHuntingData.hunt_count / 100) * (huntedPokemon.catchRate / 255), 1);

			if (Math.random() < probability) randomPokemon = huntedPokemon;
			else
				huntFooterText = localizations.hunt.format(
					input.locale,
					huntedPokemon.name.localization.get(input.locale),
					/^[aeiou]/i.test(huntedPokemon.name.localization.get(input.locale)),
					(Math.round(probability * 100 * 10000) / 10000).toString(),
				);
		}

		const isHuntedPokemon = randomPokemon.nationalId === pokemonHuntingData.pokemon_id;

		// Mega Stones
		let megaStone: LocalizationItem;
		// Increased mega stone probability: +2% per level
		const megaStoneProbability =
			Util.config.pokemon.MEGA_STONE_FREQUENCY * (1 + (userUpgrades.mega_stone_probability * 2) / 100);

		if (Math.random() < megaStoneProbability) megaStone = Util.pokedex.megaStones.random();

		// Pokémon variations & shiny pokémon
		const alolan =
			Util.pokedex.pokemonsWithAlolanVariation.has(randomPokemon.name.default) &&
			Math.random() < Util.config.pokemon.ALOLA_FREQUENCY;
		const galarian =
			Util.pokedex.pokemonsWithAlolanVariation.has(randomPokemon.name.default) &&
			Math.random() < Util.config.pokemon.GALAR_FREQUENCY;

		const variationType: VariationTypeName = alolan
			? VariationTypeName.alola
			: galarian
			? VariationTypeName.galar
			: VariationTypeName.default;

		// Increased shiny probability: +2% per level
		const shinyProbability =
			Util.config.pokemon.SHINY_FREQUENCY * (1 + (userUpgrades.shiny_pokemon_probability * 2) / 100);

		const shiny = Math.random() < shinyProbability;

		// Catch reward
		const catchReward = Math.round(
			Util.config.pokemon.CATCH_REWARD *
				((255 / randomPokemon.catchRate) *
					(shiny ? Util.config.pokemon.SHINY_REWARD_MULTIPLIER : 1) *
					(alolan ? Util.config.pokemon.ALOLA_REWARD_MULTIPLIER : 1) *
					(galarian ? Util.config.pokemon.GALAR_REWARD_MULTIPLIER : 1)),
		);

		await Util.database.query(
			`
			BEGIN;

			INSERT INTO user_pokemon VALUES ('${input.user.id}', ${randomPokemon.nationalId}, ${shiny}, '${variationType}', ${
				VariationName.default
			}, 1)
			ON CONFLICT (user_id, pokemon_id, shiny, variation_type, variation)
			DO UPDATE SET caught = user_pokemon.caught + 1
			WHERE
				user_pokemon.user_id = EXCLUDED.user_id AND
				user_pokemon.pokemon_id = EXCLUDED.pokemon_id AND
				user_pokemon.shiny = EXCLUDED.shiny AND
				user_pokemon.variation_type = EXCLUDED.variation_type AND
				user_pokemon.variation = EXCLUDED.variation;

			UPDATE pokemon_hunting SET hunt_count = ${isHuntedPokemon ? 0 : "hunt_count + 1"} WHERE user_id = '${input.user.id}';

			UPDATE "user" SET currency_money = currency_money + ${catchReward} WHERE id = '${input.user.id}';

			COMMIT;
			`,
		);

		const isNewPokemon = !caughtPokemonsData.some(
			(caughtPokemon) => caughtPokemon.pokemon_id === randomPokemon.nationalId,
		);

		const embedColor = shiny
			? Util.config.pokemon.SHINY_EMBED_COLOR
			: randomPokemon.legendary || randomPokemon.ultraBeast
			? Util.config.pokemon.LEGENDARY_ULTRA_BEAST_EMBED_COLOR
			: input.guild.members.me.displayColor;

		const reply = await input.reply({
			embeds: [
				{
					author: {
						name: isNewPokemon ? localizations.new.format(input.locale) : localizations.caught.format(input.locale),
						icon_url: "https://i.imgur.com/Asfk9R0.png",
					},
					image: {
						url: randomPokemon.image(shiny, variationType, VariationName.default),
					},
					color: embedColor,
					description:
						localizations.title.format(
							input.locale,
							input.user.toString(),
							randomPokemon.formatName(NameFormat.FULL, shiny, variationType, VariationName.default, input.locale),
							/^[aeiou]/i.test(
								randomPokemon.formatName(NameFormat.RAW, shiny, variationType, VariationName.default, input.locale),
							) && !shiny,
							catchReward.toString(),
						) +
						(megaStone ? localizations.mega_stone.format(input.locale, megaStone.localization.get(input.locale)) : ""),
					footer: {
						text: `${Util.config.DEFAULT_EMBED_FOOTER_TEXT} | ${!isHuntedPokemon ? huntFooterText : ""}`,
						icon_url: input.user.displayAvatarURL(),
					},
				},
			],
		});

		const logChannel = input.client.channels.cache.get(Util.config.pokemon.POKEMON_LOG_CHANNEL_ID) as TextChannel;

		const logEmbedColor = shiny
			? Util.config.pokemon.SHINY_EMBED_COLOR
			: randomPokemon.legendary || randomPokemon.ultraBeast
			? Util.config.pokemon.LEGENDARY_ULTRA_BEAST_EMBED_COLOR
			: Util.config.MAIN_COLOR;

		logChannel.send({
			embeds: [
				{
					author: {
						name: `#${input.channel.name} (${input.guild.name})`,
						url: reply.url,
						icon_url: input.guild.iconURL(),
					},
					thumbnail: {
						url: randomPokemon.image(shiny, variationType),
					},
					color: logEmbedColor,
					description: localizations.title.format(
						Locale.EnglishGB,
						input.user.toString(),
						!randomPokemon.formatName(NameFormat.FULL, shiny, variationType, VariationName.default, Locale.EnglishGB),
						/^[aeiou]/i.test(
							randomPokemon.formatName(NameFormat.RAW, shiny, variationType, VariationName.default, Locale.EnglishGB),
						) && !shiny,
						catchReward.toString(),
					),
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						icon_url: input.user.displayAvatarURL(),
					},
				},
			],
		});
	},
};

export default command;

interface UserUpgrades {
	catch_cooldown_reduction: number;
	new_pokemon_probability: number;
	legendary_ultra_beast_probability: number;
	shiny_pokemon_probability: number;
	mega_stone_probability: number;
}
