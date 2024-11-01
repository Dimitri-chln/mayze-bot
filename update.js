const pg = require("pg");
const { VariationTypeName, VariationName } = require("./src/structures/pokemons/Pokemon");

const db = new pg.Client({
	connectionString: "postgresql://postgres:Lakitu!89@localhost:5432/mayze",
});

db.connect().then(async () => {
	const { rows: pokemons } = await db.query("SELECT * FROM pokemon");

	for (const pokemon of pokemons) {
		for (const userId of Object.keys(pokemon.users)) {
			db.query(
				`
				INSERT INTO user_pokemon VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				ON CONFLICT (user_id, pokemon_id, shiny, variation_type, variation)
				DO NOTHING
				`,
				[
					userId,
					pokemon.national_id,
					pokemon.shiny,
					VariationTypeName[pokemon.variation_type],
					VariationName[pokemon.variation],
					pokemon.users[userId].caught,
					pokemon.users[userId].favorite,
					pokemon.users[userId].nickname,
				],
			);
		}
	}
});
