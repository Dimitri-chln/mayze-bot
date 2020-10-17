module.exports = {
    name: "pokemon",
    description: "Regarde la liste des pokémons que tu as attrapés",
    aliases: ["pokemons", "pkmn", "pkm", "poke"],
    args: 0,
    usage: "[-legendary] [-shiny] [-alolan] [-galarian]",
    execute(message, args) {
        const Discord = require("discord.js");
        const paginationEmbed = require("discord.js-pagination");
        const dataRead = require("../functions/dataRead.js");
        const pokemonDatabase = dataRead("pokemonDatabase.json");
        var userPokemons = pokemonDatabase[message.author.id] || [];
        
        if (args.includes("-legendary")) {
            
        };
        if (args.includes("-shiny")) {
            userPokemons = userPokemons.filter(p => p.name.includes("⭐"));
        };
        if (args.includes("-alolan")) {
            userPokemons = userPokemons.filter(p => p.name.includes("d'Alola"));
        };
        if (args.includes("-galarian")) {
            userPokemons = userPokemons.filter(p => p.name.includes("de Galar"));
        };
        
        const pkmPerPage = 15;
        var pages = [];
        var embed = new Discord.MessageEmbed()
            .setAuthor(`Pokémons de ${message.author.username}`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
            .setColor("#010101")
            .setDescription("*Aucun pokémon ne correspond à la recherche*");
        if (!userPokemons.length) {
            pages.push(embed);
        };
        for (i = 0; i < userPokemons.length; i += pkmPerPage) {
            embed = new Discord.MessageEmbed()
                .setAuthor(`Pokémons de ${message.author.username}`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
                .setColor("#010101")
                .setDescription(userPokemons.slice(i, i+pkmPerPage).map(p => `**${p.name}**: ${p.caught}`).join("\n"));
            pages.push(embed);
        };
        
        paginationEmbed(message, pages, ["⏪", "⏩"], 180000);
    }
}