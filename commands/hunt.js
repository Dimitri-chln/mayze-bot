const { Message } = require("discord.js");

const command = {
	name: "hunt",
	description: {
		fr: "Chasse un pokémon en particulier",
		en: "Hunt a specific pokémon"
	},
	aliases: [],
	args: 1,
	usage: "<pokémon> | none",
    slashOptions: [
        {
            name: "pokemon",
            description: "The pokémon to hunt (use none to reset it)",
            type: 3,
            required: true
        }
    ],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");
		
        const pokemonName = args
			? args.join(" ").toLowerCase().trim()
			: options[0].options[0].value.toLowerCase().trim();
        
        if (pokemonName === "none") {
            message.client.pg.query(`DELETE FROM pokemon_hunting WHERE user_id = '${message.author.id}'`)
                .then(() => {
                    message.react("✅").catch(console.error);
                }).catch(err => {
                    console.error(err);
                    message.channel.send(language.errors.database).catch(console.error)
                });
            
            return;
        }
				
		const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => name.toLowerCase() === pokemonName));
		if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

        const msg = await message.channel.send(language.get(language.confirmation, pokemon.names[languageCode] || pokemon.names.en)).catch(console.error);
        await msg.react("✅").catch(console.error);
        await msg.react("❌").catch(console.error);

        const filter = (reaction, user) => user.id === message.author.id && ["✅", "❌"].includes(reaction.emoji.name);
        const collected = await msg.awaitReactions(filter, { max: 1, time: 30000 }).catch(console.error);
        msg.reactions.removeAll().catch(console.error);

        if (!collected.size) return;
        if (collected.first().emoji.name === "✅") {
            await message.client.pg.query(`INSERT INTO pokemon_hunting VALUES ('${message.author.id}', ${pokemon.national_id}) ON CONFLICT (user_id) DO UPDATE SET pokemon_id = ${pokemon.national_id}, hunt_count = 0 WHERE pokemon_hunting.user_id = '${message.author.id}'`);
            message.reply(language.get(language.hunting, pokemon.names[languageCode] || pokemon.names.en)).catch(console.error);

        } else {
            message.reply(language.cancelled).catch(console.error);
        }
	}
};

module.exports = command;