module.exports = {
  name: "catch",
  description: "Attrape un pokémon !",
  aliases: ["c"],
  cooldown: 300,
  args: 0,
  usage: "",
  execute(message, args) {
    if (message.client.herokuMode) return message.reply("Cette commande est indisponible pour le moment (voir `*heroku`)");
    const dataRead = require("../functions/dataRead.js");
    const dataWrite = require("../functions/dataWrite.js");
    const ownerID = require("../config.json").ownerID;
    const pokedex = require("../database/pokedex.json");

    const shinyFrequency = 0.004,
      alolanFrequency = 0.1,
      galarianFrequency = 0.1;

    const random = Math.random() * message.client.pokedexWeight.slice(-1)[0];
    const randomPokemon = message.client.pokedexWeight.find(
      (n, i, a) => random <= n && random > a[i - 1]
    );
    const pokemon =
      pokedex[message.client.pokedexWeight.lastIndexOf(randomPokemon) - 1];

    var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.img}.png`;

    var randomAlolan = Math.random(),
      alolanText = "";
    if (randomAlolan < alolanFrequency && pokemon.alolan) {
      alolanText = " d'Alola";
      img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.alolan}.png`;
    }
    var randomGalarian = Math.random(),
      galarianText = "";
    if (randomGalarian < galarianFrequency && pokemon.galarian && alolanText === "") {
      galarianText = " de Galar";
      img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.galarian}.png`;
    }
    var randomShiny = Math.random(),
      shinyText = "",
      embedColor = "#010101";
    if (randomShiny < shinyFrequency) {
      shinyText = "⭐ ";
      embedColor = "#ddbb20";
      img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.en.toLowerCase()}.png`;
    }
    const pokemonName = shinyText + pokemon.fr + alolanText + galarianText;
    
    var pokemonDatabase = dataRead("pokemonDatabase.json");
    var userPokemons = pokemonDatabase[message.author.id] || [];
    var caughtPokemon = userPokemons.find(p => p.name === pokemonName) || {"name": pokemonName, "caught": 0};
    const index = userPokemons.indexOf(caughtPokemon);
    if (index > -1) {
        userPokemons.splice(index, 1);
    };
    caughtPokemon.caught ++;
    userPokemons.push(caughtPokemon);
    userPokemons.sort(function(a, b) {
        if (a.caught - b.caught > 0) return -1;
        if (a.caught - b.caught < 0) return 1;
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
    });
    
    var author = "Nouveau pokémon! 🎗️";
    if (caughtPokemon.caught > 1) {
        author = "Pokémon capturé!"
    };
    message.channel.send({
      embed: {
        author: {
          name: author,
          icon_url: "https://i.imgur.com/uJlfMAd.png"
        },
        thumbnail: {
          url: img
        },
        color: embedColor,
        description: `<@${message.author.id}> a attrapé un ${pokemonName} !`,
        /* image: {
          url: img
        }, */
        footer: {
          text: "✨Mayze✨",
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }
      }
    });
    
    pokemonDatabase[message.author.id] = userPokemons;
    dataWrite("pokemonDatabase.json", pokemonDatabase);
  }
};
