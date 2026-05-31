import { ChatInputCommandInteraction, LabelBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle, User } from "discord.js";
import type { DefaultCommand } from "../models/command.model.ts";
import { NotesCollection } from "../collections/notes.collection.ts";


const command: DefaultCommand = {
    data: new SlashCommandBuilder()
        .setName("write")
        .setDescription("Réalise les notes pour la session d'un joueur")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("L'utilisateur pour lequel tu veux écrire les notes")
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const user: User | null = interaction.options.getUser("user");

        if (!user) {
            await interaction.reply({ content: "Utilisateur non trouvé.", flags: MessageFlags.Ephemeral });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId("writenote-" + user.id)
            .setTitle(`Écrire une note pour ${user.tag}`);

        const noteInput = new TextInputBuilder()
            .setCustomId("note")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const noteLabel = new LabelBuilder()
            .setTextInputComponent(noteInput)
            .setLabel("Note de session");


        modal.addLabelComponents(noteLabel);

        await interaction.showModal(modal);

    }
}

export async function receiveNote(interaction: ModalSubmitInteraction, userId: string, note: string): Promise<void> {
    interaction.deferReply({ flags: MessageFlags.Ephemeral});
    await NotesCollection.add(userId, note);

    interaction.editReply({ content: "Note enregistrée avec succès !" });
}

export default command;