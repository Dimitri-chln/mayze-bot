"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var googleapis_1 = require("googleapis");
var Pokedex_1 = __importDefault(require("./types/pokemon/Pokedex"));
var parseArgs_1 = __importDefault(require("./utils/misc/parseArgs"));
var findMember_1 = __importDefault(require("./utils/misc/findMember"));
var config_json_1 = __importDefault(require("./config.json"));
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.config = config_json_1.default;
    Util.googleAuth = new googleapis_1.google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), ["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    Util.languages = new discord_js_1.Collection();
    Util.commands = new discord_js_1.Collection();
    Util.messageResponses = [];
    Util.reactionCommands = [];
    Util.palettes = new discord_js_1.Collection();
    Util.canvas = new discord_js_1.Collection();
    Util.parseArgs = parseArgs_1.default;
    Util.xpMessages = new discord_js_1.Collection();
    Util.sniping = {
        deletedMessages: new discord_js_1.Collection(),
        editedMessages: new discord_js_1.Collection(),
        messageReactions: new discord_js_1.Collection()
    };
    Util.songDisplays = new discord_js_1.Collection();
    Util.pokedex = Pokedex_1.default;
    Util.findMember = findMember_1.default;
    Util.amongUsGames = new discord_js_1.Collection();
    Util.russianRouletteGames = new discord_js_1.Collection();
    return Util;
}());
exports.default = Util;
