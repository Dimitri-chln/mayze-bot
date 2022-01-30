// const { generateDependencyReport } = require("@discordjs/voice");
// console.log(generateDependencyReport());


require("dotenv").config();
const Translations = require("./dist/types/structures/Translations").default;
const test = new Translations("cmd_lapse-of-time", "fr");
test.init().then(t => {
	console.log(t.data.invalid_date());
});