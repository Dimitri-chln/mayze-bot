const { Message, MessageEmbed } = require("discord.js");

 /**
  * @param {Message} message The message channel to send the paginator
  * @param {MessageEmbed[]} pages The pages of the paginator
  * @param {string[]} emojiList The reactions added to the paginator
  * @param {number} timeout The time the paginator lasts
  * @returns {MessageEmbed} The pages the paginator finished on
  */
 async function pagination(message, pages, emojiList = ["⏪", "⏩"], timeout = 120000) {
    if (emojiList.length !== 2) throw new Error("Need two emojis.");
    
	let page = 0;
    const currentPage = await message.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    for (const emoji of emojiList) await currentPage.react(emoji);
    
    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
    const reactionCollector = currentPage.createReactionCollector(filter, { time: timeout });
    
	reactionCollector.on("collect", (reaction, user) => {
		reaction.users.remove(user);
		switch (reaction.emoji.name) {
			case emojiList[0]:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case emojiList[1]:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		currentPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    });
    
	reactionCollector.on("end", () => {
		if (!currentPage.deleted) {
			currentPage.reactions.removeAll()
		}
	});
	return currentPage;
};

module.exports = pagination;
