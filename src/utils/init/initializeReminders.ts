import Util from "../../Util";

import { DatabaseReminder } from "../../types/Database";

export default async function initializeReminders() {
	setInterval(async () => {
		try {
			const { rows: reminders }: { rows: DatabaseReminder[] } = await Util.database.query("SELECT * FROM reminder");

			reminders.forEach(async (reminder) => {
				const timestamp = new Date(reminder.timestamp);

				if (Date.now() > timestamp.valueOf()) {
					try {
						Util.client.users.fetch(reminder.user_id).then((user) => {
							user.send(`⏰ | ${reminder.content}`);
						});

						// If occurrences is 1, delete the reminder as the last occurence has just been sent
						if (reminder.repeat && reminder.occurrences !== 1) {
							// -1 stands for infinite occurrences
							if (reminder.occurrences === -1)
								Util.database.query("UPDATE reminder SET timestamp = $1 WHERE id = $2", [
									new Date(timestamp.valueOf() + reminder.repeat),
									reminder.id,
								]);
							else
								Util.database.query("UPDATE reminder SET timestamp = $1, occurrences = occurrences - 1 WHERE id = $2", [
									new Date(timestamp.valueOf() + reminder.repeat),
									reminder.id,
								]);
						} else {
							Util.database.query("DELETE FROM reminder WHERE id = $1", [reminder.id]);
						}
					} catch (err) {
						console.error(err);
					}
				}
			});
		} catch (err) {
			console.error(err);
		}
	}, 10_000);
}
