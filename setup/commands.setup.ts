import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { DiscordClient } from "../models/client.model.ts";
import type { DefaultCommand } from "../models/command.model.ts";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN || "");



export async function setup(client: DiscordClient): Promise<void> {
    const foldersPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".ts"));
    const commands: DefaultCommand[] = [];
    await Promise.all(commandFiles.map(async (file) => {
        const filePath = path.join(foldersPath, file);
        const module = await import(pathToFileURL(filePath).href);
        const command = module.default as DefaultCommand;
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }));

    await registerCommands(client, commands);
}

async function registerCommands(client: DiscordClient, commands: DefaultCommand[]): Promise<void> {
    try {
        const applicationId = client.application?.id ?? client.user?.id;

        if (!applicationId) {
            throw new Error("Cannot register commands before the client application is available.");
        }

        const guildId = process.env.DISCORD_GUILD_ID;
        const route = guildId
            ? Routes.applicationGuildCommands(applicationId, guildId)
            : Routes.applicationCommands(applicationId);

        await rest.put(
            route,
            { body: commands.map(command => command.data.toJSON()) },
        );
        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }  
}
