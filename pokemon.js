module.exports = {
    name: "pokemon",
    description: "Attrape un pokémon !",
    aliases: ["poke", "pkm", "p"],
    cooldown: 900,
    args: 0,
    usage: "",
    execute(message, args) {
        
        // const fs = require("fs");
        const pokedex = require("../fixedData/pokedex.json");
        
        const legendaryFrequency = 0.3;
        const mythicalFrequency = 0.5;
        const ultraBeastFrequency = 0.2;
        const shinyFrequency = 0.004;
        
        var legendaryRate = legendaryFrequency;
        var mythicalRate = legendaryFrequency + mythicalFrequency;
        var ultraBeastRate = legendaryFrequency + mythicalFrequency+ ultraBeastFrequency;
        var normalRate = 1 - (legendaryRate + mythicalRate + ultraBeastRate);
        
        var pokemon;
        
        /* var r = Math.random();
        if (r < legendaryRate) {
            pokemon = pokedex.legendaries[Math.floor(Math.random()*pokedex.legendaries.length)];
        } else if (r < mythicalRate) {
            pokemon = pokedex.mythicals[Math.floor(Math.random()*pokedex.mythicals.length)];
        } else if (r < ultraBeastRate) {
            pokemon = pokedex.ultraBeasts[Math.floor(Math.random()*pokedex.ultraBeasts.length)];
        } else {
            pokemon = pokedex.normals[Math.floor(Math.random()*pokedex.normals.length)];
        }; */
        
        var randomPokemon = Math.floor(Math.random()*pokedex.dex.length);
        pokemon = {
            en: pokedex.dex[randomPokemon],
            fr: "",
            img: ("00" + (randomPokemon+1)).substr(-3)
        };
        
        var randomShiny = Math.random();
        var shiny = "";
        var embedColor = "#010101";
        var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.img}.png`;
        if (randomShiny < shinyFrequency) {
            shiny = " ⭐ ";
            embedColor= "#ddbb20";
            img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.en.toLowerCase()}.png`
        };
        
        message.channel.send({
            embed: {
                title: "Nouveau pokémon!",
                color: embedColor,
                description: `<@${message.author.id}> a attrapé un ${pokemon.en}${shiny}!`,
                image: {
                    url: img
                },
                footer: {
                    text: "✨Mayze✨"
                }
            }
        });
        
        /* const pokemonJson = fs.readFileSync("../userData/pokemonData.json");
        const pokemonData = JSON.parse(pokemonData);
        userData = pokemonData.get(message.author.id);
        if (!userData) {
            pokemonData.get(message.author.id) = {}.set(pokemon.en, 1);
        } else {
            if (!userData.get(pokemon.en)) {
                userData.get(pokemon.en) = 1;
            } else {
                userData.get(pokemon.en) += 1;
            };
            pokemonData.get(message.author.id) = userData;
        };
        const newPokemonJson = JSON.stringify(pokemonData, null, 4);
        fs.writeFileSync("../userData/pokemonData.json", newPokemonJson); */
    }
};