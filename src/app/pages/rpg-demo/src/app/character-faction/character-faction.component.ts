// src/app/character-faction/character-faction.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

interface CharacterFaction {
  name: string;
  description: string;
}

@Component({
  selector: "app-character-faction",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Character Factions</h1>

    <p *ngIf="isLoading">Loading factions...</p>

    <p *ngIf="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <div id="characterFactions" class="faction-list">
      <div
        class="faction-card"
        *ngFor="let faction of characterFactions"
        [attr.data-faction]="faction.name"
      >
        <h2 class="faction-title">{{ faction.name }}</h2>
        <p class="faction-description">
          {{ faction.description }}
        </p>
      </div>

      <p *ngIf="!isLoading && !errorMessage && characterFactions.length === 0">
        No factions found.
      </p>
    </div>
  `,
  styleUrls: ["./character-faction.component.css"],
})
export class CharacterFactionComponent implements OnInit {
  characterFactions: CharacterFaction[] = [];
  errorMessage = "";
  isLoading = false;

  // 🔴 This MUST match your Node route
  private readonly apiUrl = "http://localhost:3000/api/character-factions";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCharacterFactions();
  }

  getCharacterFactions(): void {
    this.isLoading = true;
    this.errorMessage = "";
    this.characterFactions = [];

    this.http.get<CharacterFaction[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.characterFactions = data || [];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error("HTTP error when loading factions:", err);
        this.isLoading = false;
        this.characterFactions = [];

        this.errorMessage =
          "Unable to load character factions. Make sure character-factions.js is running on port 3000 and the URL path is correct.";
      },
    });
  }
}
