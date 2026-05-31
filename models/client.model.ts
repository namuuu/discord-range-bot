import { Client } from "discord.js";
import type { DefaultCommand } from "./command.model.ts";

export interface DiscordClient extends Client {
    commands: Map<string, DefaultCommand>;
}