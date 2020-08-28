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

    const shinyFrequency = 0.004, alolanFrequency = 0.1, galarianFrequency = 0.1;

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
      const random = Math.random() * message.client.pokedexWeight.slice(-1)[0];
      const randomPokemon = message.client.pokedexWeight.find(
        (n, i, a) => random <= n && random > a[i - 1]
      );
      pokemon =
        pokedex[message.client.pokedexWeight.lastIndexOf(randomPokemon) - 1];
    }
    var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.img}.png`;

    var randomAlolan = Math.random(), alolanText = "";
    if (randomAlolan < alolanFrequency && pokemon.alolan) {
      alolanText = "Alolan ";
      img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.alolan}.png`;
    }
    
    var randomGalarian = Math.random(), galarianText = "";
    if (randomGalarian < galarianFrequency && pokemon.galarian && alolanText === "") {
      galarianText = "Galarian ";
      img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.galarian}.png`;
    }

    var randomShiny = Math.random(), shinyText = "", embedColor = "#010101";
    if (randomShiny < shinyFrequency) {
      shinyText = " ⭐ ";
      embedColor = "#ddbb20";
      img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.en.toLowerCase()}.png`;
    }

    message.channel.send({
      embed: {
        title: "Nouveau pokémon!",
        color: embedColor,
        description: `<@${message.author.id}> a attrapé un ${alolanText}${galarianText}${pokemon.en}${shinyText}!`,
        image: {
          url: img
        },
        footer: {
          text: "✨Mayze✨"
        }
      }
    });
  }
};
