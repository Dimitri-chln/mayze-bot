module.exports = {
    name: "love",
    description: "Donne le pourcentage d'amour entre 2 personnes",
    aliases: ["lc", "lovecalc"],
    args: 1,
    usage: "<mention/texte> [mention/texte]",
    execute(message, args) {
        if (args){
            var love1, love2
            if (args.length == 1){
                love1 = `<@${message.author.id}>`;
                love2 = args[0];
            } else if (args.length >= 2){
                 love1 = args[0];
                 love2 = args[1];
             };
        message.channel.send({
                 embed:{
                    title: "💕 Love calculator 💕",
                    color: "#010101",
                    description: `${love1} + ${love2} = ${Math.round(Math.random()*100)} %`,
                    footer: {
                       text: "✨Mayze✨"
                    }
                }
            });
        };
    }
};