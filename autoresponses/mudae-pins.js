const command = {
    async execute(message) {
        //if (message.author.id !== "432610292342587392") return;
        const legRegex = /Félicitations, vous venez de gagner un\.\.\. Un\.\.\. <:\w+:\d{18}> (\w+)\?!/;
        const shinyRegex = /Vous avez eu un <:\w+:\d{18}> (\w+) <:shinySparkles:653808283244560402>\./;

        console.log(message.content.match(legRegex));
        console.log(message.content.match(shinyRegex));
    }
};

module.exports = command;