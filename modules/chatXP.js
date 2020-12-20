const { Message } = require("discord.js");

/**
 * @param {Message} message The sent message
 * @param {number} newXP The XP to add to the member
 */
async function chatXP(message, newXP) {
	const { xpPerLevel } = require("../config.json");
	try {
		let xp = newXP;
		const { rows } = await message.client.pg.query(`SELECT * FROM levels WHERE user_id='${message.author.id}'`);

		if (rows.length) {
			xp += rows[0].xp;
			message.client.pg.query(`UPDATE levels SET xp = ${xp} WHERE user_id='${message.author.id}'`).catch(console.error);
		} else {
			message.client.pg.query(`INSERT INTO levels VALUES ('${message.author.id}', ${xp})`).catch(console.error);
		}

		if (xp % xpPerLevel < newXP) {
			message.channel.send(`**${message.author}** est passé au niveau **${Math.floor(xp / xpPerLevel)}** ! <:foxmayze:763146438120046632>`).catch(console.error);
		}

		console.log(`Gave ${newXP}xp to ${message.author.tag}`);
	} catch (err) {
		console.error(err);
	}
};

module.exports = chatXP;