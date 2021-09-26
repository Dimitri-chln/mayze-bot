const { Message, MessageEmbed, MessageAttachment } = require("discord.js");

/**
 * @typedef {object} Page
 * @property {MessageEmbed} embed
 * @property {MessageAttachment[]} files
 */

 /**
  * @param {Message} message The message channel to send the paginator
  * @param {Page[] | MessageEmbed[]} pages The pages of the paginator
  * @param {string[]} emojiList The reactions added to the paginator
  * @param {number} timeout The time the paginator lasts
  * @returns {MessageEmbed} The pages the paginator finished on
  */
 async function pagination(message, pages, emojiList = ["⏪", "⏩"], timeout = 120000) {
    if (emojiList.length !== 2) throw new Error("Need two emojis.");
    
	let page = 0;

	pages = pages.map((p, i) => {
		if (p instanceof MessageEmbed) p.setFooter(`Page ${i + 1} / ${pages.length}`);
		else p.embed.setFooter(`Page ${i + 1} / ${pages.length}`);
		return p;
	});

    const currentPage = await message.channel.send(pages[page]).catch(console.error);
	if (!currentPage) throw new Error("Failed to send paginator");

    for (const emoji of emojiList) await currentPage.react(emoji).catch(console.error);
    
    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
    const reactionCollector = currentPage.createReactionCollector(filter);

	let timer = setTimeout(() => reactionCollector.stop(), timeout);
    
	reactionCollector.on("collect", (reaction, user) => {
		reaction.users.remove(user);
		clearTimeout(timer);
		timer = setTimeout(() => reactionCollector.stop(), timeout);
		
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

		currentPage.edit(pages[page]).catch(console.error);
    });
    
	reactionCollector.on("end", () => {
		if (!currentPage.deleted) {
			currentPage.reactions.removeAll().catch(console.error);
		}
	});
	return currentPage;
};

module.exports = pagination;
