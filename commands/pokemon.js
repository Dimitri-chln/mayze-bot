module.exports = {
  name: "pokemon",
  description: "Attrape un pokémon !",
  aliases: ["poke", "pkm", "p"],
  cooldown: 900,
  args: 0,
  usage: "",
  execute(message, args) {
    // const fs = require("fs");
    const ownerID = require("../config.json").ownerID;
    const loots = require("../database/pokeLoots.json");
    const pokedex = require("../database/pokedex.json");
    const shinyFrequency = 0.004;
    var pokemon;

    if (message.author.id !== ownerID || args[0] == ".") {
      const randomPokemon = Math.floor(Math.random() * loots.dex.length);
      pokemon = {
        en: loots.dex[randomPokemon],
        fr: "",
        img: ("00" + (randomPokemon + 1)).substr(-3)
      };
    } else {
      // new Pokemon selection
      const dropSum = (currentSum, currentPokemon) =>
        currentSum + currentPokemon.drop;
      const pokedexWeight = [0];
      pokedexWeight.push(
        ...pokedex.map((p, i) => pokedex.slice(0, i + 1).reduce(dropSum, 0))
      );
      const randomPokemon = Math.random() * pokedexWeight.slice(-1)[0];
      const pokeN = pokedexWeight.find(
        (n, i, a) => randomPokemon <= n && randomPokemon > a[i - 1]
      );
      pokemon = pokedex[pokedexWeight.lastIndexOf(pokeN) - 1];
    }

    var randomShiny = Math.random();
    var shiny = "";
    var embedColor = "#010101";
    var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.img}.png`;
    if (randomShiny < shinyFrequency) {
      shiny = " ⭐ ";
      embedColor = "#ddbb20";
      img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.en.toLowerCase()}.png`;
    }
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
