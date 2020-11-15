module.exports = {
    name: "sql",
    description: "Effectue une requête SQL sur la base de données PostgreSQL",
    aliases: ["postgresql", "pg", "psql"],
    args: 1,
    usage: "<query>",
    ownerOnly: true,
    async execute(message, args) {
        const databaseSQL = require("../functions/databaseSQL.js");
        try {
            const res = await databaseSQL(args.join(" "));
            message.channel.send(`\`\`\`js\n${JSON.stringify(res, null, 4)}\`\`\``);
        } catch (err) {
            console.log(err);
            if (res) console.log(res);
        }
        
    }
};
