import Event from "../types/Event";
import Util from "../Util";

const event: Event = {
	name: "error",
	once: false,

	run: async (error: Error) => {
		console.error(error);
	},
};

export default event;
