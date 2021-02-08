async function userValidation(user, message) {
    try {
        await message.react("✅");
        await message.react("❌");
    } catch (err) { throw err; }
    const filter = (reaction, u) => {
        return ["✅", "❌"].includes(reaction.emoji.name) && user.id === u.id;
    };
    const collected = await message.awaitReactions(filter, { max: 1, time: 60000 }).catch(console.error);
    if (!collected) return false;
    if (collected.first().emoji.name === "✅") return true;
    return false;
}

module.exports = userValidation;