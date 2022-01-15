import { Message } from "discord.js";

export default interface MessageResponse {
    run(message: Message): Promise<void>;
}