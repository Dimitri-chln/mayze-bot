module.exports = {
  name: "pokedex",
  description: "Obtiens des informations sur un pokémon",
  aliases: ["dex", "pd"],
  args: 1,
  usage: "<pokémon>",
  execute(message, args) {
    const pokedexBot = require("../database/pokedex.json");
    const Pokedex = require("pokedex-promise-v2");
    const P = new Pokedex();

    const pokemonName = args
      .join(" ")
      .toLowerCase()
      .replace(/♂/, "m")
      .replace(/♀/, "f");

    P.getPokemonByName(pokemonName, function(pokemon, err) {
      if (err) console.error(err);
      if (!pokemon) return message.reply("ce pokémon n'existe pas");
      const pkmn = pokedexBot.find(p => p.en.toLowerCase() === pokemon.name) || {};
      var pkmnNames = [], pkmnForms = [];
      if (pkmn.fr) pkmnNames.push("🇫🇷 " + pkmn.fr);
      if (pkmn.mega) pkmnForms.push("• Mega");
      if (pkmn.megax && pkmn.megay) pkmnForms.push("• Mega X/Y");
      if (pkmn.giga) pkmnForms.push("• Gigantamax");
      if (pkmn.alolan) pkmnForms.push("• Alolan");
      if (pkmn.galarian) pkmnForms.push("• Galarian");

      message.channel.send({
        embed: {
          title: `${pokemon.name.substr(0, 1).toUpperCase() +
            pokemon.name.substr(1)} #${("00" + pokemon.id).substr(-3)}`,
          color: "#010101",
          //description: pokemon.description,
          fields: [
            {
              name: "Alternative names:",
              value: pkmnNames.join("\n") || "?",
              inline: true
            },
            {
              name: "Forms:",
              value: pkmnForms.join("\n") || "?",
              inline: true
            },
            {
              name: "Type:",
              value: `${pokemon.types
                .map(
                  t =>
                    t.type.name.substr(0, 1).toUpperCase() +
                    t.type.name.substr(1)
                )
                .join(" - ") || "?"}`,
              inline: true
            },
            {
              name: "Base stats:",
              value: `**HP:** ${pokemon.stats[0].base_stat ||
                "?"}\n**Attack:** ${pokemon.stats[1].base_stat ||
                "?"}\n**Defense:** ${pokemon.stats[2].base_stat ||
                "?"}\n**Sp. Attack:** ${pokemon.stats[3].base_stat ||
                "?"}\n**Sp. Def:** ${pokemon.stats[4].base_stat ||
                "?"}\n**Speed:** ${pokemon.stats[5].base_stat || "?"}\n`,
              inline: true
            },
            {
              name: "Height:",
              value: `${pokemon.height / 10 || "?"}m`,
              inline: true
            },
            {
              name: "Weight:",
              value: `${pokemon.weight / 10 || "?"}kg`,
              inline: true
            }
          ],
          image: {
            url:
              pokemon.sprites.other["official-artwork"].front_default ||
              `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(
                "00" + pokemon.id
              ).substr(-3)}.png`
          },
          footer: {
            text: "✨Mayze✨"
          }
        }
      });
    });
  }
};
