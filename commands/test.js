module.exports = {
    name: "test",
    description: "Test test",
    aliases: [],
    cooldown: 1,
    args: 3,
    usage: "<pokedex_id> <pokedex_name> <is_shiny>",
    ownerOnly: true,
    async execute(message, args) {
        const databaseSQL = require("../functions/databaseSQL.js");
        try {
            const res1 = await databaseSQL(`INSERT INTO pokemons (caught_by, pokedex_id, pokedex_name, is_shiny) VALUES (\`${message.author.id}\`, ${args[0]}, \`${args[1]}\`, ${args[2]})`);
            message.channel.send(`La table contient désormais ${res1.rowCount} rows`);
        } catch (err) {
            console.log(err);
        }
        try {
            const res2 = await databaseSQL(`SELECT * FROM pokemons`);
            message.channel.send(`\`\`\`js\n${JSON.stringify(res2.rows, null, 4)}\n\`\`\``);
        } catch (err) {
            console.log(err);
        }
    }
};
