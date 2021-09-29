const { Message, Collection } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");
		const { CATCH_REWARD, SHINY_MULTIPLIER, ALOLAN_MULTIPLIER } = require("../config.json");

		const { "rows": pokemons }  = (await message.client.pg.query(
			"SELECT * FROM pokemons"
		).catch(console.error)) || {};
		if (!pokemons) return message.channel.send(language.errors.database).catch(console.error);

		/**@type {Collection<string, number>} */
		const users = new Collection();

		for (const pokemon of pokemons) {
			const catchReward = Math.round(CATCH_REWARD * (
				255 / (
					pokemon.legendary || pokemon.ultra_beast ? 3 : (pokedex.findPokemon(pokemon.pokedex_id) ?? pokedex.findPokemon("Snover")).catch_rate
				) * (pokemon.shiny ? SHINY_MULTIPLIER : 1) * (pokemon.variation === "alolan" ? ALOLAN_MULTIPLIER : 1)
			));

			for (const userID of Object.keys(pokemon.users)) {
				users.set(
					userID,
					(users.get(userID) ?? 0) + catchReward * pokemon.users[userID].caught
				);
			}
		}

		message.channel.send({
			embed: {
				color: message.guild.me.displayColor,
				description: users.map((money, userID) => `<@${userID}> => ${money}`).join("\n")
			}
		}).catch(console.error);

		for (const [ userID, money ] of users) {
			message.client.pg.query(
				`
				INSERT INTO currency VALUES ($1, $2)
				ON CONFLICT (user_id)
				DO UPDATE SET money = currency.money + $2
				WHERE currency.user_id = EXCLUDED.user_id
				`,
				[ userID, money ]
			)
				.catch(err => {
					console.error(err);
					message.channel.send(`Failed adding ✨${money} to <@${userID}>`).catch(console.error);
				});
		}
	}
};

module.exports = command;