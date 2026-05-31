import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { DefaultCommand } from "../models/command.model.ts";
import { NotesCollection } from "../collections/notes.collection.ts";
import NotesEmbed from "../embed/notes.embed.ts";

const command: DefaultCommand = {
    data: new SlashCommandBuilder()
        .setName("notes")
        .setDescription("Obtiens les notes que Namu t'as écrit lors d'une session !")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("L'utilisateur dont tu veux les notes")
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const user = interaction.options.getUser("user") || interaction.user;

        const notes = await NotesCollection.get(user.id);

        if (notes.length === 0) {
            await interaction.reply({ content: `Aucune note trouvée pour ${user.tag}.`, flags: MessageFlags.Ephemeral });
            return;
        }

        const embed = NotesEmbed.display(notes, user.tag, user.displayAvatarURL(), 0);

        await interaction.reply({ embeds: [embed] });
    }
}

export default command;