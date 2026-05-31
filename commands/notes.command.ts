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
        
        await interaction.deferReply();

        const notes = await NotesCollection.get(user.id);

        if (notes.length === 0) {
            await interaction.editReply({ content: `Aucune note trouvée pour ${user.tag}.` });
            return;
        }

        const embed = NotesEmbed.display(notes, user.tag, user.displayAvatarURL(), 0);
        
        console.log(`Displaying notes for user: ${user.tag} with ${notes.length} notes found.`);
        await interaction.editReply({ embeds: [embed] });
    }
}

export default command;