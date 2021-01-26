const { Message } = require("discord.js");

/**
 * @param {Message} message The sent message
 * @param {number} xp The XP to add to the member
 */
async function chatXP(message, xp) {
	const newXp = xp;
	const { baseXp, xpIncrement } = require("../config.json");
	const { rows } = await message.client.pg.query(`SELECT * FROM levels WHERE user_id='${message.author.id}'`).catch(console.error);

	if (rows.length) {
		xp += rows[0].xp;
		message.client.pg.query(`UPDATE levels SET xp = ${xp} WHERE user_id='${message.author.id}'`).catch(console.error);
	} else {
		message.client.pg.query(`INSERT INTO levels VALUES ('${message.author.id}', ${xp})`).catch(console.error);
	}
		if (getLevel(xp).xpLeft < newXp) {
		message.channel.send(`**${message.author}** est passé au niveau **${getLevel(xp).level}** ! <:foxmayze:763146438120046632>`).catch(console.error);
	}
	// console.log(`Gave ${xp}xp to ${message.author.tag}`);

	function getLevel(xp, lvl = 0) {
		const xpPerLevel = baseXp + lvl * xpIncrement;
		if (xp < xpPerLevel) return { level: lvl, xpLeft: xp};
		return getLevel(xp - xpPerLevel, lvl + 1);
	}
};

module.exports = chatXP;