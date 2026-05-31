import type { UserData } from "../models/users.model.ts";
import { db } from "../setup/firestore.setup.ts";
import { UsersStore } from "../store/users.store.ts";


export class UsersCollection {

    /**
     * Fetches the user data for a given user ID.
     * @param userId The ID of the user whose data is to be fetched.
     * @returns A promise resolving to the user data or null if the user does not exist.
     */
    static async get(userId: string): Promise<UserData | null> {
        const cachedUser = UsersStore.getUser(userId);
        if (cachedUser) {
            return cachedUser;
        }

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return null;
        }

        const userData = userDoc.data() as UserData;
        UsersStore.setUser(userId, userData);
        return userData;
    }

    static async set(userId: string, userData: UserData): Promise<void> {
        await db.collection("users").doc(userId).set(userData);
        UsersStore.setUser(userId, userData);
    }
}