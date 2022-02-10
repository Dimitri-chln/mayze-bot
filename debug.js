// const { generateDependencyReport } = require("@discordjs/voice");
// console.log(generateDependencyReport());

require("dotenv").config();

const Translations = require("./dist/types/structures/Translations").default;

(async function () {
	const translations1 = await new Translations("cmd_trade").init();
	console.log(translations1);

	const translations2 = await new Translations("index_levels").init();
	console.log(translations2);

	const translations3 = await new Translations("cmd_trade").init();
	console.log(translations3);
})();