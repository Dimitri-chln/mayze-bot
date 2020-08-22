module.exports = {
  name: "pokedex",
  description: "Obtiens des informations sur un pokémon",
  aliases: ["dex", "pd"],
  args: 1,
  usage: "<pokémon>",
  execute(message, args) {
    const Pokedex = require("pokedex-promise-v2");
    const P = new Pokedex();

    const pokemonName = args.join(" ").toLowerCase();
    P.getPokemonByName(pokemonName, function(pokemon, err) {
      if (!err) {
        if (!pokemon) {
          return message.reply("ce pokémon n'existe pas");
        }
        message.channel.send({
          embed: {
            title: `${pokemon.name.substr(0, 1).toUpperCase() +
              pokemon.name.substr(1)} #${("00" + pokemon.id).substr(-3)}`,
            color: "#010101",
            description: pokemon.description,
            fields: [
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
              },
              {
                name: "Type:",
                value: `${pokemon.types
                  .map(
                    t =>
                      t.type.name.substr(0, 1).toUpperCase() +
                      t.type.name.substr(1)
                  )
                  .join("\n") || "?"}`,
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
      } else {
        message.reply(
          "ce pokémon n'existe pas. Utilise uniquement des noms anglais"
        );
      }
    });
  }
};
