import { Timestamp } from "firebase-admin/firestore";

export interface SessionNote {
    date: Timestamp;
    notes: string;
}