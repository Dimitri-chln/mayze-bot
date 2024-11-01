// const pg = require("pg");

// const pokemons = require("./src/assets/pokemons.json");

// const db = new pg.Client({
// 	connectionString: "postgresql://postgres:Lakitu!89@localhost:5432/mayze",
// });

// db.connect().then(async () => {
// 	const megaStones = pokemons
// 		.filter((p) => p.variations.some((v) => v.variation_type === "mega"))
// 		.map((p) => p.variations.filter((v) => v.variation_type === "mega").map((v) => v.mega_stone))
// 		.flat();

// 	megaStones.forEach((m) => {
// 		db.query(
// 			`
// 			INSERT INTO mega_stone (name) VALUES ($1)
// 			`,
// 			[m],
// 		);
// 	});
// });

console.log("command=ping".match(/^(?:([\w-]+)=)?"?(.+)"?$/));
console.log('command="ping pong"'.match(/^(?:([\w-]+)=)?"?(.+)"?$/));
console.log("ping".match(/^(?:([\w-]+)=)?"?(.+)"?$/));
