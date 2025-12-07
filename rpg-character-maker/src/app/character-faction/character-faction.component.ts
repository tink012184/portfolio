// src/app/character-faction/character-faction.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

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

    <div id="characterFactions" class="faction-list">
      <div
        class="faction-card"
        *ngFor="let faction of characterFactions"
        [attr.data-faction]="faction.name">
        <h2 class="faction-title">{{ faction.name }}</h2>
        <p class="faction-description">
          {{ faction.description }}
        </p>
      </div>

      <p *ngIf="characterFactions.length === 0">No factions found.</p>
    </div>
  `,
  styleUrls: ["./character-faction.component.css"],
})
export class CharacterFactionComponent implements OnInit {
  characterFactions: CharacterFaction[] = [];

  ngOnInit(): void {
    // Static data – no HTTP, no server required
    this.characterFactions = [
      {
        name: "The Iron Brotherhood",
        description:
          "The Iron Brotherhood is a faction of brave and honorable warriors. They value strength, courage, and loyalty above all else. Their members are known for their iron will and unbreakable spirit.",
      },
      {
        name: "The Arcane Order",
        description:
          "The Arcane Order is a faction of powerful mages. They seek knowledge and wisdom, and their magic is a tool to understand the mysteries of the universe. They are respected and feared for their magical prowess.",
      },
      {
        name: "The Silent Knives",
        description:
          "The Silent Knives is a faction of skilled rogues. They value stealth, cunning, and precision. Their members are masters of the shadows, using their skills for espionage and assassination.",
      },
      {
        name: "The Nature's Guardians",
        description:
          "The Nature's Guardians is a faction of druids and rangers. They are the protectors of the natural world, using their abilities to maintain the balance between civilization and nature.",
      },
    ];
  }
}
