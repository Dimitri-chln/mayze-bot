async function userValidation(userMessage, botMessage) {
    try {
        await botMessage.react("✅");
        await botMessage.react("❌");
    } catch (err) { throw err; }
    const filter = (reaction, user) => {
        return ["✅", "❌"].includes(reaction.emoji.name) && user.id === userMessage.author.id;
    };
    var collected;
    try {
        collected = await botMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] });
    } catch (err) { return false; }
    if (collected.first().emoji.name === "✅") return true;
    return false;
}

module.exports = userValidation;