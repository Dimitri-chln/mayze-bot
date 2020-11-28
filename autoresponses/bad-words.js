const command = {
	async execute(message) {
		const badWords = ["plop", "mich", "chocolatine"];
		if (message.author.bot) return;
		const badWordsRegex = new RegExp(`(\\b${badWords.join("\\b)|(\\b")}\\b)`, "i");
		console.log(badWordsRegex)
		if (badWordsRegex.test(message.content)) {
			message.delete().catch(console.error);
			const msg = await message.reply("surveille ton langage").catch(console.error);
			msg.delete({ timeout: 4000 }).catch(console.error);
		}
	}
};

module.exports = command;