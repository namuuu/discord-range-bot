import type { SessionNote } from "../models/notes.model.ts";
import { db } from "../setup/firestore.setup.ts";
import { NotesStore } from "../store/notes.store.ts";

export class NotesCollection {

    /**
     * Fetches the notes collection for a given user ID.
     * @param userId The ID of the user whose notes collection is to be fetched.
     * @returns A promise resolving to an array of session notes.
     */
    static async get(userId: string): Promise<SessionNote[]> {
        const sessionNotes: SessionNote[] | null = NotesStore.getUserNotes(userId);

        if (sessionNotes) {
            return sessionNotes;
        }

        const querySnapshot = await db.collection("notes")
            .where("student", "==", db.doc(`users/${userId}`))
            .get();
        if (querySnapshot.empty) {
            NotesStore.setUserNotes(userId, []);
            return [];
        }

        const notes: SessionNote[] = querySnapshot.docs.map(doc => doc.data() as SessionNote);
        NotesStore.setUserNotes(userId, notes);
        return notes;
    };

    /**
     * Adds a new note to the user's notes collection.
     * @param userId The ID of the user to whom the note belongs.
     * @param note The session note to be added.
     * @returns A promise that resolves when the note has been added.
     */
    static async add(userId: string, note: string): Promise<void> {
        await db.collection("notes").add({
            student: db.doc(`users/${userId}`),
            date: new Date(),
            notes: note
        });
    }
}