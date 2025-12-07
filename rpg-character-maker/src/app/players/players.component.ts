import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Character, CharacterService } from "../shared/character.service";
import { GuildService, Guild } from "../shared/guild.service";

@Component({
  selector: "app-players",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="players">
      <h1 class="visually-hidden">Players</h1>

      <!-- PREMADE CHARACTERS -->
      <h2>Premade Characters</h2>
      <div class="grid">
        <details class="card" *ngFor="let c of premadeCharacters">
          <summary class="card-summary">
            <span class="badge" [ngClass]="getClassBadge(c.class)">
              {{ c.name }} • {{ c.class }}
            </span>
          </summary>

          <div class="card-body">
            <p class="name">{{ c.name }}</p>
            <ul class="meta">
              <li><strong>Gender:</strong> {{ c.gender }}</li>
              <li *ngIf="c.faction">
                <strong>Faction:</strong> {{ c.faction }}
              </li>
              <li *ngIf="c.startingLocation">
                <strong>Starting Location:</strong>
                {{ c.startingLocation }}
              </li>
              <li *ngIf="c.funFact">
                <strong>Fun Fact:</strong> {{ c.funFact }}
              </li>
            </ul>
          </div>
        </details>
      </div>

      <!-- CREATED CHARACTERS -->
      <section class="created-characters">
        <h2>Created Characters</h2>

        <div class="grid" *ngIf="createdCharacters.length > 0; else noCreated">
          <details class="card" *ngFor="let c of createdCharacters">
            <summary class="card-summary">
              <span class="badge" [ngClass]="getClassBadge(c.class)">
                {{ c.name }} • {{ c.class }}
              </span>
            </summary>

            <div class="card-body">
              <p class="name">{{ c.name }}</p>
              <ul class="meta">
                <li><strong>Gender:</strong> {{ c.gender }}</li>
                <li *ngIf="c.faction">
                  <strong>Faction:</strong> {{ c.faction }}
                </li>
                <li *ngIf="c.startingLocation">
                  <strong>Starting Location:</strong>
                  {{ c.startingLocation }}
                </li>
                <li *ngIf="c.funFact">
                  <strong>Fun Fact:</strong> {{ c.funFact }}
                </li>
              </ul>
            </div>
          </details>
        </div>

        <ng-template #noCreated>
          <p class="placeholder">
            No created characters yet. Visit the Character Creator to add one!
          </p>
        </ng-template>
      </section>

      <!-- CREATED GUILDS -->
      <section class="guilds-section">
        <h2>Created Guilds</h2>

        <p *ngIf="createdGuilds.length === 0" class="placeholder">
          No guilds have been created yet.
        </p>

        <table *ngIf="createdGuilds.length > 0" class="guild-table">
          <thead>
            <tr>
              <th>Guild Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Notification Preference</th>
              <th>Accepted Terms</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of createdGuilds">
              <td>{{ g.guildName }}</td>
              <td>{{ g.description }}</td>
              <td>{{ g.type || "—" }}</td>
              <td>{{ g.notificationPreference }}</td>
              <td>{{ g.acceptTerms ? "Yes" : "No" }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  `,
  styleUrls: ["./players.component.css"],
})
export class PlayersComponent {
  premadeCharacters: Character[] = [];
  createdCharacters: Character[] = [];

  constructor(
    private characterService: CharacterService,
    private guildService: GuildService
  ) {
    this.premadeCharacters = this.characterService.premadeCharacters;
    this.createdCharacters = this.characterService.createdCharacters;
  }

  get createdGuilds(): Guild[] {
    return this.guildService.getGuilds();
  }

  // Map the character class ("Fighter", "Wizard", etc.) to the CSS
  // badge class names (fighter, wizard, rogue, druid).
  getClassBadge(cls: Character["class"]): string {
    switch (cls) {
      case "Fighter":
        return "fighter";
      case "Wizard":
        return "wizard";
      case "Rogue":
        return "rogue";
      case "Druid":
        return "druid";
      default:
        return "";
    }
  }
}
