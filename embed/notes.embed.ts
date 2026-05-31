import { EmbedBuilder } from "discord.js";
import type { SessionNote } from "../models/notes.model.ts";

export default class NotesEmbed {
    /**
     * Creates an embed for a specific session note. If sessionNumber is 0, it will display the most recent note.
     * @param notes An array of session notes to choose from.
     * @param userTag The tag of the user whose notes are being displayed.
     * @param userAvatarURL The avatar URL of the user whose notes are being displayed.
     * @param sessionNumber The index of the session note to display (0 for most recent). Defaults to 0.
     * @returns An EmbedBuilder instance containing the formatted note information.
     */
    static display(notes: SessionNote[], userTag: string, userAvatarURL: string, sessionNumber: number = 0): EmbedBuilder {
        // Sort notes from newest to oldest
        notes.sort((a, b) => b.date.toMillis() - a.date.toMillis());

        const selectedNote: SessionNote | null = notes[sessionNumber] || null;

        if(!selectedNote) {
            return new EmbedBuilder()
                .setAuthor({ name: `Notes de ${userTag}`, iconURL: userAvatarURL })
                .setDescription("Aucune note trouvée pour ce numéro de session.");
        }

        const embed = new EmbedBuilder()
                    .setAuthor({ name: `Notes de ${userTag}`, iconURL: userAvatarURL })
                    .setDescription(selectedNote.notes)
                    .setFooter({ text: `Session ${sessionNumber + 1} sur ${notes.length}` })
                    .setTimestamp(selectedNote.date.toDate())
                    .setColor("#B22222");

        return embed;
    }
}