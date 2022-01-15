"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pokedex_1 = __importDefault(require("./types/pokemon/Pokedex"));
var voiceXp_1 = __importDefault(require("./utils/voiceXp"));
var parseArgs_1 = __importDefault(require("./utils/parseArgs"));
var chatXp_1 = __importDefault(require("./utils/chatXp"));
var findMember_1 = __importDefault(require("./utils/findMember"));
var config_json_1 = __importDefault(require("./config.json"));
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.config = config_json_1.default;
    Util.chatXp = chatXp_1.default;
    Util.voiceXp = voiceXp_1.default;
    Util.parseArgs = parseArgs_1.default;
    Util.pokedex = Pokedex_1.default;
    Util.findMember = findMember_1.default;
    return Util;
}());
exports.default = Util;
