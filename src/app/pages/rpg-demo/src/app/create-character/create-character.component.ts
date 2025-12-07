import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { factions } from "../shared/character-factions";
import { Character, CharacterService } from "../shared/character.service";
import { GuildService, Guild } from "../shared/guild.service";

@Component({
  selector: "app-create-character",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="create-character">
      <h1>Character Creator</h1>
      <p class="intro">
        Build a new hero by filling out each section of the form. All fields are
        required so your character feels complete.
      </p>

      <form
        #characterForm="ngForm"
        (ngSubmit)="onSubmit(characterForm)"
        novalidate
      >
        <!-- Name -->
        <div
          class="form-group"
          [class.has-error]="name.invalid && name.touched"
        >
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minlength="2"
            maxlength="40"
            [(ngModel)]="model.name"
            #name="ngModel"
          />
          <div class="error" *ngIf="name.touched && name.invalid">
            <span *ngIf="name.errors?.['required']">Name is required.</span>
            <span *ngIf="name.errors?.['minlength']">
              Name must be at least 2 characters.
            </span>
            <span *ngIf="name.errors?.['maxlength']">
              Name cannot be more than 40 characters.
            </span>
          </div>
        </div>

        <!-- Gender -->
        <div
          class="form-group"
          [class.has-error]="gender.invalid && gender.touched"
        >
          <label for="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            required
            [(ngModel)]="model.gender"
            #gender="ngModel"
          >
            <option [ngValue]="'Male'">Male</option>
            <option [ngValue]="'Female'">Female</option>
            <option [ngValue]="'Other'">Other</option>
          </select>
          <div class="error" *ngIf="gender.touched && gender.invalid">
            <span *ngIf="gender.errors?.['required']">
              Gender is required.
            </span>
          </div>
        </div>

        <!-- Class -->
        <div
          class="form-group"
          [class.has-error]="charClass.invalid && charClass.touched"
        >
          <label for="class">Class</label>
          <select
            id="class"
            name="class"
            required
            [(ngModel)]="model.class"
            #charClass="ngModel"
          >
            <option [ngValue]="'Fighter'">Fighter</option>
            <option [ngValue]="'Wizard'">Wizard</option>
            <option [ngValue]="'Rogue'">Rogue</option>
            <option [ngValue]="'Druid'">Druid</option>
          </select>
          <div class="error" *ngIf="charClass.touched && charClass.invalid">
            <span *ngIf="charClass.errors?.['required']">
              Class is required.
            </span>
          </div>
        </div>

        <!-- Faction -->
        <div
          class="form-group"
          [class.has-error]="faction.invalid && faction.touched"
        >
          <label for="faction">Faction</label>
          <select
            id="faction"
            name="faction"
            required
            [(ngModel)]="model.faction"
            #faction="ngModel"
          >
            <option [ngValue]="''" disabled>Select a faction</option>
            <option *ngFor="let f of factions" [ngValue]="f.name">
              {{ f.name }}
            </option>
          </select>
          <div class="error" *ngIf="faction.touched && faction.invalid">
            <span *ngIf="faction.errors?.['required']">
              Faction is required.
            </span>
          </div>
        </div>

        <!-- Starting Location -->
        <div
          class="form-group"
          [class.has-error]="
            startingLocation.invalid && startingLocation.touched
          "
        >
          <label for="startingLocation">Starting Location</label>
          <input
            id="startingLocation"
            name="startingLocation"
            type="text"
            required
            minlength="2"
            [(ngModel)]="model.startingLocation"
            #startingLocation="ngModel"
          />
          <div
            class="error"
            *ngIf="startingLocation.touched && startingLocation.invalid"
          >
            <span *ngIf="startingLocation.errors?.['required']">
              Starting location is required.
            </span>
            <span *ngIf="startingLocation.errors?.['minlength']">
              Starting location must be at least 2 characters.
            </span>
          </div>
        </div>

        <!-- Fun Fact -->
        <div
          class="form-group"
          [class.has-error]="funFact.invalid && funFact.touched"
        >
          <label for="funFact">Fun Fact</label>
          <textarea
            id="funFact"
            name="funFact"
            rows="3"
            required
            maxlength="200"
            [(ngModel)]="model.funFact"
            #funFact="ngModel"
          ></textarea>
          <div class="error" *ngIf="funFact.touched && funFact.invalid">
            <span *ngIf="funFact.errors?.['required']">
              Fun fact is required.
            </span>
            <span *ngIf="funFact.errors?.['maxlength']">
              Fun fact cannot be more than 200 characters.
            </span>
          </div>
        </div>

        <!-- Guild dropdown (optional) -->
        <div class="form-row">
          <label for="guildName">Guild (optional)</label>
          <select id="guildName" name="guildName" [(ngModel)]="model.guildName">
            <option value="">No guild</option>
            <option *ngFor="let g of guilds" [value]="g.guildName">
              {{ g.guildName }} ({{ g.type || "Guild" }})
            </option>
          </select>
        </div>

        <button type="submit" [disabled]="characterForm.invalid">
          Create Character
        </button>
      </form>

      <!-- Created characters preview -->
      <section class="created-list" *ngIf="createdCharacters.length > 0">
        <h2>Created Characters</h2>
        <ul>
          <li *ngFor="let c of createdCharacters">
            <h3>{{ c.name }} ({{ c.class }} - {{ c.gender }})</h3>
            <p>
              <strong>Faction:</strong> {{ c.faction }} |
              <strong>Starts in:</strong> {{ c.startingLocation }}
            </p>
            <p class="fun-fact"><strong>Fun Fact:</strong> {{ c.funFact }}</p>
          </li>
        </ul>
      </section>
    </section>
  `,
  styles: [
    `
      .create-character {
        max-width: 720px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .create-character h1 {
        margin-bottom: 0.5rem;
      }

      .intro {
        margin-bottom: 1.5rem;
      }

      form {
        display: grid;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group.has-error input,
      .form-group.has-error select,
      .form-group.has-error textarea {
        border-color: #b91c1c;
        outline-color: #b91c1c;
      }

      label {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      input,
      select,
      textarea {
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid #4b5563;
        font: inherit;
      }

      .error {
        color: #b91c1c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      button[type="submit"] {
        justify-self: flex-start;
        padding: 0.5rem 1.25rem;
        border-radius: 9999px;
        border: none;
        font-weight: 600;
        cursor: pointer;
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .created-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .created-list li {
        border: 1px solid #1f2937;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        margin-bottom: 0.75rem;
      }

      .created-list h3 {
        margin: 0 0 0.25rem;
      }

      .fun-fact {
        margin: 0.25rem 0 0;
        font-style: italic;
      }
    `,
  ],
})
export class CreateCharacterComponent {
  // 🔹 Single source of truth for the form
  model: Character = {
    name: "",
    gender: "Male",
    class: "Fighter",
    faction: "",
    startingLocation: "",
    funFact: "",
    guildName: "",
  };

  factions = factions;

  constructor(
    private characterService: CharacterService,
    private guildService: GuildService
  ) {}

  // always up-to-date list of guilds from the service
  get guilds(): Guild[] {
    return this.guildService.getGuilds();
  }

  // use the service’s array for the template
  get createdCharacters(): Character[] {
    return this.characterService.createdCharacters;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    // save the new character in the shared service
    this.characterService.addCharacter({ ...this.model });

    // reset model with defaults
    this.model = {
      name: "",
      gender: "Male",
      class: "Fighter",
      faction: "",
      startingLocation: "",
      funFact: "",
      guildName: "",
    };

    form.resetForm(this.model);
  }
}
