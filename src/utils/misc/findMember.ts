import { Guild } from "discord.js";

export default function findMember(guild: Guild, search: string) {
	return guild.members.cache.find(
		(member) =>
			member.user.id === search ||
			member.user.username.toLowerCase() === search.toLowerCase() ||
			member.displayName.toLowerCase() === search.toLowerCase() ||
			member.user.username.toLowerCase().startsWith(search.toLowerCase()) ||
			member.displayName.toLowerCase().startsWith(search.toLowerCase()) ||
			member.user.username.includes(search.toLowerCase()) ||
			member.displayName.toLowerCase().includes(search.toLowerCase()),
	);
}
