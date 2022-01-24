"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Pokedex_1 = __importDefault(require("./types/pokemon/Pokedex"));
var voiceXp_1 = __importDefault(require("./utils/misc/voiceXp"));
var parseArgs_1 = __importDefault(require("./utils/misc/parseArgs"));
var chatXp_1 = __importDefault(require("./utils/misc/chatXp"));
var findMember_1 = __importDefault(require("./utils/misc/findMember"));
var config_json_1 = __importDefault(require("./config.json"));
var package_json_1 = require("../package.json");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.config = config_json_1.default;
    Util.version = package_json_1.version;
    Util.languages = new discord_js_1.Collection();
    Util.commands = new discord_js_1.Collection();
    Util.messageResponses = [];
    Util.reactionCommands = [];
    Util.commandCooldowns = new discord_js_1.Collection();
    Util.channelCooldowns = new discord_js_1.Collection();
    Util.palettes = new discord_js_1.Collection();
    Util.canvas = new discord_js_1.Collection();
    Util.chatXp = chatXp_1.default;
    Util.voiceXp = voiceXp_1.default;
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
    return Util;
}());
exports.default = Util;
