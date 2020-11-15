module.exports = {
    name: "test",
    description: "Test test",
    aliases: [],
    cooldown: 0.1,
    args: 1,
    usage: "[expression]",
    ownerOnly: true,
    async execute(message, args) {
        const databaseSQL = require("../functions/databaseSQL.js");
        try {
            const res = databaseSQL(`INSERT INTO pokemons (caught_at, caught_by, nickname, pokedex_id, pokedex_name, is_shiny) VALUES (${Date.now()}, 307815349699608577, null, 330, flygon, false)`);
            message.channel.send(`La table contient désormais ${res.rowCount} rows`);
        } catch (err) {
            console.log(err);
        }
        try {
            const res = databaseSQL(`SELECT * FROM pokemons`);
            message.channel.send(`\`\`\`js\n${JSON.stringify(res, null, 4)}\n\`\`\``);
        } catch (err) {
            console.log(err);
        }
    }
};
