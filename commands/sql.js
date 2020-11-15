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
            switch (res.command) {
                case "SELECT":
                    message.channel.send(`\`\`\`js\n${JSON.stringify(res.rows, null, 4)}\`\`\``);
                    break;
                case "INSERT":
                    message.channel.send(`Le tableau contient désormais ${res.rowCount} lignes`);
                    break;
                default:
                    message.channel.send("Requête effectuée");
            }
        } catch (err) {
            console.log(err);
        }
        
    }
};
