const { Message } = require("discord.js");

const language = {
	get: (text, ...args) => text
		.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1])
		.replace(/\[\d+?\?.*?:.*?\]/gs, a => {
			let m = a.match(/\[(\d+?)\?(.*?):(.*?)\]/s);
			if (args[parseInt(m[1]) - 1]) return m[2];
			else return m[3];
		})
		.replace(/~d/g, ":")
		.replace(/~q/g, "?"),
	level_up: {
		fr: "**{1}** est passé au niveau **{2}** ! <:foxmayze:763146438120046632>",
		en: "**{1}** is now level **{2}**! <:foxmayze:763146438120046632>"
	}
}

/**
 * @param {Message} message The sent message
 * @param {number} xp The XP to add to the member
 */
async function chatXP(message, xp, languageCode = "en") {
	const newXp = xp;
	const { BASE_XP, XP_INCREMENT } = require("../config.json");
	const { rows } = (await message.client.pg.query(`SELECT * FROM levels WHERE user_id='${message.author.id}'`).catch(console.error)) || {};
	if (!rows) return;
	
	if (rows.length) {
		xp += rows[0].xp;
		message.client.pg.query(`UPDATE levels SET xp = ${xp} WHERE user_id='${message.author.id}'`).catch(console.error);
	} else {
		message.client.pg.query(`INSERT INTO levels VALUES ('${message.author.id}', ${xp})`).catch(console.error);
	}
	if (getLevel(xp).xpLeft < newXp && message.guild.id === "689164798264606784") {
		message.channel.send(language.get(language.level_up[languageCode], message.author, getLevel(xp).level)).catch(console.error);
	}
	// console.log(`Gave ${xp}xp to ${message.author.tag}`);

	function getLevel(xp, lvl = 0) {
		const xpPerLevel = BASE_XP + lvl * XP_INCREMENT;
		if (xp < xpPerLevel) return { level: lvl, xpLeft: xp };
		return getLevel(xp - xpPerLevel, lvl + 1);
	}
};

module.exports = chatXP;