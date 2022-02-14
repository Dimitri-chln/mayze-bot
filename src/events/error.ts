import Event from "../types/structures/Event";
import Util from "../Util";

const event: Event = {
	name: "error",
	once: false,

	run: async (error: Error) => {
		console.error(error);
	},
};

export default event;
