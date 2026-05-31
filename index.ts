import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { setup as setupCommands } from "./setup/commands.setup.ts";
import type { DiscordClient } from "./models/client.model.ts";
import { receiveNote } from "./commands/write.command.ts";

const client = Object.assign(
    new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] }),
    { commands: new Map() },
) as DiscordClient;
dotenv.config({quiet: true});

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    await setupCommands(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const [action, userId] = interaction.customId.split("-");
    console.log(`Received modal submit with action: ${action} and userId: ${userId}`);
    switch (action) {
        case "writenote":
            const noteInput = interaction.fields.getTextInputValue("note");
            await receiveNote(interaction, userId, noteInput);
            break;
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);