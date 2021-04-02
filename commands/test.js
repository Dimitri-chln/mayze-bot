const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		let alphabet = {
			'z': ['abcdefghijklm', 'znopqrstuvwxy'],
			'y': ['abcdefghijklm', 'znopqrstuvwxy'],
			'x': ['abcdefghijklm', 'yznopqrstuvwx'],
			'w': ['abcdefghijklm', 'yznopqrstuvwx'],
			'v': ['abcdefghijklm', 'xyznopqrstuvw'],
			'u': ['abcdefghijklm', 'xyznopqrstuvw'],
			't': ['abcdefghijklm', 'wxyznopqrstuv'],
			's': ['abcdefghijklm', 'wxyznopqrstuv'],
			'r': ['abcdefghijklm', 'vwxyznopqrstu'],
			'q': ['abcdefghijklm', 'vwxyznopqrstu'],
			'p': ['abcdefghijklm', 'uvwxyznopqrst'],
			'o': ['abcdefghijklm', 'uvwxyznopqrst'],
			'n': ['abcdefghijklm', 'tuvwxyznopqrs'],
			'm': ['abcdefghijklm', 'tuvwxyznopqrs'],
			'l': ['abcdefghijklm', 'stuvwxyznopqr'],
			'k': ['abcdefghijklm', 'stuvwxyznopqr'],
			'j': ['abcdefghijklm', 'rstuvwxyznopq'],
			'i': ['abcdefghijklm', 'rstuvwxyznopq'],
			'h': ['abcdefghijklm', 'qrstuvwxyznop'],
			'g': ['abcdefghijklm', 'qrstuvwxyznop'],
			'f': ['abcdefghijklm', 'pqrstuvwxyzno'],
			'e': ['abcdefghijklm', 'pqrstuvwxyzno'],
			'd': ['abcdefghijklm', 'opqrstuvwxyzn'],
			'c': ['abcdefghijklm', 'opqrstuvwxyzn'],
			'b': ['abcdefghijklm', 'nopqrstuvwxyz'],
			'a': ['abcdefghijklm', 'nopqrstuvwxyz']
		};

		function porta(msg, key) {
			return msg.toLowerCase().split('').map((c, i) => {
				let alpha = alphabet[key[i % key.length]];
				if (alpha[0].includes(c)) return  alpha[1][alpha[0].indexOf(c)];
				else if (alpha[1].includes(c)) return alpha[0][alpha[1].indexOf(c)];
				else return c;
			}).join('');
		}


		let text = [
			'rbepcve',
			'creFhn',
			'fenwnu',
			'gqrdktem',
			'mekqtxmz',
			'indktqcf',
			'fupqnrezgr',
			'mfkkwz',
			'eOfjeunijg',
			'vwlyhufvpyt',
			'fRwoqoc',
			'ncvlqglkenr'
		];

		message.channel.send(porta(args[0], args[1] || 'ricked')).catch(console.error);
	}
};

module.exports = command;