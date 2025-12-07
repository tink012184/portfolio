import { Injectable } from "@angular/core";

export interface Guild {
  guildName: string;
  description: string;
  type: "Competitive" | "Casual" | "Social" | "Educational" | "";
  notificationPreference: "Email" | "SMS" | "InApp";
  acceptTerms: boolean;
}

@Injectable({
  providedIn: "root",
})
export class GuildService {
  private readonly storageKey = "rpg_guilds";
  private guilds: Guild[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        this.guilds = JSON.parse(stored) as Guild[];
      }
    } catch {
      this.guilds = [];
    }
  }

  private saveToStorage(): void {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.guilds));
    } catch {
      // ignore storage errors in this assignment
    }
  }

  getGuilds(): Guild[] {
    // return a copy so the array can't be mutated from outside
    return [...this.guilds];
  }

  addGuild(guild: Guild): void {
    this.guilds = [...this.guilds, guild];
    this.saveToStorage();
  }

  clearGuilds(): void {
    this.guilds = [];
    sessionStorage.removeItem(this.storageKey);
  }
}
