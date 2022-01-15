import { Queue, Utils as Util } from "discord-music-player";



export default function getQueueDuration(queue: Queue): number {
	return queue.dispatcher
		? Util.MillisecondsToTime(queue.songs.reduce((sum, song) => sum + Util.TimeToMilliseconds(song.duration), 0)
			- queue.dispatcher?.streamTime
			- (queue.songs.length ? queue.songs[0].seekTime as number : 0))
		: 0;
}