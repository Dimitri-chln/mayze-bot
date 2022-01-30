"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findMember(guild, search) {
    return guild.members.cache.find(function (member) {
        return member.user.id === search ||
            member.user.username.toLowerCase() === search.toLowerCase() ||
            member.displayName.toLowerCase() === search.toLowerCase() ||
            member.user.username.toLowerCase().startsWith(search.toLowerCase()) ||
            member.displayName.toLowerCase().startsWith(search.toLowerCase()) ||
            member.user.username.includes(search.toLowerCase()) ||
            member.displayName.toLowerCase().includes(search.toLowerCase());
    });
}
exports.default = findMember;
