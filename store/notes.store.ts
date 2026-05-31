import type { SessionNote } from "../models/notes.model.ts";

const notesStore: Map<string, SessionNote[]> = new Map();

export class NotesStore {
    static getUserNotes(userId: string): SessionNote[] | null {
        return notesStore.get(userId) || null;
    }

    static addUserNote(userId: string, note: SessionNote): void {
        const userNotes = notesStore.get(userId) || [];
        userNotes.push(note);
        notesStore.set(userId, userNotes);
    }

    static clearUserNotes(userId: string): void {
        notesStore.delete(userId);
    }

    static setUserNotes(userId: string, notes: SessionNote[]): void {
        notesStore.set(userId, notes);
    }
}