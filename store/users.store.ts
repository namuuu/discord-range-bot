import type { UserData } from "../models/users.model.ts";


const userMap = new Map<string, UserData>();

export class UsersStore {
    static getUser(userId: string): UserData | null {
        return userMap.get(userId) || null;
    }

    static setUser(userId: string, userData: UserData): void {
        userMap.set(userId, userData);
    }
}