import Util from "../../Util";
import { Client, ClientConfig } from "pg";

export default function connectDatabase(config: ClientConfig) {
	Util.database = new Client(config);

	Util.database.once("error", (err) => {
		console.error(err);
		Util.database
			.end()
			.then(() => connectDatabase(config))
			.catch(console.error);
	});

	Util.database
		.connect()
		.then(() => console.log("Connected to the database"))
		.catch(console.error);

	setTimeout(() => {
		Util.database
			.end()
			.then(() => connectDatabase(config))
			.catch(console.error);
	}, 3_600_000); // 1 hour
}
