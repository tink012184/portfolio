import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Guild, GuildService } from "../shared/guild.service";

@Component({
  selector: "app-create-guild",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="create-guild">
      <h1>Guild Creator</h1>
      <p class="intro">
        Build a new guild for your RPG world. Every field is required to make
        sure your guild feels intentional and balanced.
      </p>

      <form
        #guildForm="ngForm"
        (ngSubmit)="onSubmit(guildForm)"
        novalidate
        aria-label="Create guild form"
      >
        <!-- Guild Name -->
        <div
          class="form-group"
          [class.has-error]="guildName.invalid && guildName.touched"
        >
          <label for="guildName">Guild Name</label>
          <input
            id="guildName"
            name="guildName"
            type="text"
            required
            minlength="2"
            maxlength="60"
            [(ngModel)]="model.guildName"
            #guildName="ngModel"
          />
          <div class="error" *ngIf="guildName.touched && guildName.invalid">
            <span *ngIf="guildName.errors?.['required']">
              Guild name is required.
            </span>
            <span *ngIf="guildName.errors?.['minlength']">
              Guild name must be at least 2 characters.
            </span>
            <span *ngIf="guildName.errors?.['maxlength']">
              Guild name cannot be more than 60 characters.
            </span>
          </div>
        </div>

        <!-- Description -->
        <div
          class="form-group"
          [class.has-error]="description.invalid && description.touched"
        >
          <label for="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            required
            minlength="10"
            maxlength="300"
            [(ngModel)]="model.description"
            #description="ngModel"
          ></textarea>
          <div class="error" *ngIf="description.touched && description.invalid">
            <span *ngIf="description.errors?.['required']">
              Description is required.
            </span>
            <span *ngIf="description.errors?.['minlength']">
              Description must be at least 10 characters.
            </span>
            <span *ngIf="description.errors?.['maxlength']">
              Description cannot exceed 300 characters.
            </span>
          </div>
        </div>

        <!-- Guild Type -->
        <div
          class="form-group"
          [class.has-error]="guildType.invalid && guildType.touched"
        >
          <label for="type">Guild Type</label>
          <select
            id="type"
            name="type"
            required
            [(ngModel)]="model.type"
            #guildType="ngModel"
          >
            <option [ngValue]="''" disabled>-- Select a type --</option>
            <option [ngValue]="'Competitive'">Competitive</option>
            <option [ngValue]="'Casual'">Casual</option>
            <option [ngValue]="'Social'">Social</option>
            <option [ngValue]="'Educational'">Educational</option>
          </select>
          <div class="error" *ngIf="guildType.touched && guildType.invalid">
            <span *ngIf="guildType.errors?.['required']">
              Guild type is required.
            </span>
          </div>
        </div>

        <!-- Notification Preference -->
        <fieldset
          class="form-group"
          [class.has-error]="
            notificationPreference.invalid && notificationPreference.touched
          "
        >
          <legend>Notification Preference</legend>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                name="notificationPreference"
                [ngModel]="model.notificationPreference"
                (ngModelChange)="model.notificationPreference = $event"
                value="Email"
                required
                #notificationPreference="ngModel"
              />
              Email
            </label>

            <label>
              <input
                type="radio"
                name="notificationPreference"
                [ngModel]="model.notificationPreference"
                (ngModelChange)="model.notificationPreference = $event"
                value="SMS"
                required
              />
              SMS
            </label>

            <label>
              <input
                type="radio"
                name="notificationPreference"
                [ngModel]="model.notificationPreference"
                (ngModelChange)="model.notificationPreference = $event"
                value="InApp"
                required
              />
              In-App
            </label>
          </div>
          <div
            class="error"
            *ngIf="
              notificationPreference.touched && notificationPreference.invalid
            "
          >
            <span>Notification preference is required.</span>
          </div>
        </fieldset>

        <!-- Accept Terms -->
        <div
          class="form-group terms"
          [class.has-error]="acceptTerms.invalid && acceptTerms.touched"
        >
          <label class="checkbox-label">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              required
              [(ngModel)]="model.acceptTerms"
              #acceptTerms="ngModel"
            />
            <span>I agree to the guild charter and terms of conduct.</span>
          </label>
          <div class="error" *ngIf="acceptTerms.touched && acceptTerms.invalid">
            <span>You must accept the terms before creating a guild.</span>
          </div>
        </div>

        <button type="submit" [disabled]="guildForm.invalid">
          Create guild
        </button>
      </form>

      <!-- Created guilds list -->
      <section
        class="created-list"
        *ngIf="createdGuilds.length; else emptyState"
      >
        <h2>Created Guilds</h2>
        <ul>
          <li *ngFor="let guild of createdGuilds; let i = index">
            <h3>{{ guild.guildName }}</h3>
            <p class="meta">
              <span class="pill">{{ guild.type }}</span>
              <span class="pill">
                Notifications: {{ guild.notificationPreference }}
              </span>
            </p>
            <p class="description">{{ guild.description }}</p>
            <p class="meta-small">
              Terms accepted:
              <strong>{{ guild.acceptTerms ? "Yes" : "No" }}</strong>
            </p>
          </li>
        </ul>
      </section>

      <ng-template #emptyState>
        <section class="created-list empty">
          <h2>No guilds yet</h2>
          <p>
            Once you submit the form, your guilds will appear here in a tidy
            list you can reference later.
          </p>
        </section>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .create-guild {
        max-width: 720px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .create-guild h1 {
        margin-bottom: 0.5rem;
      }

      .intro {
        margin-bottom: 1.5rem;
        color: var(--muted);
      }

      form {
        display: grid;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .form-group.has-error input,
      .form-group.has-error select,
      .form-group.has-error textarea {
        border-color: #b91c1c;
        outline-color: #b91c1c;
      }

      fieldset.form-group {
        border: 1px solid var(--edge);
        border-radius: 0.75rem;
        padding: 0.75rem 1rem 0.9rem;
      }

      legend {
        padding: 0 0.35rem;
        font-weight: 600;
      }

      .radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.35rem;
      }

      .radio-group label {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        cursor: pointer;
        font-size: 0.95rem;
      }

      .terms .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.4rem;
        font-size: 0.95rem;
      }

      label {
        font-weight: 600;
      }

      input,
      select,
      textarea {
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid #4b5563;
        font: inherit;
        background-color: #020617;
        color: var(--ink);
      }

      textarea {
        resize: vertical;
        min-height: 4.5rem;
      }

      .error {
        color: #f97373;
        font-size: 0.85rem;
        margin-top: 0.1rem;
      }

      button[type="submit"] {
        justify-self: flex-start;
        padding: 0.5rem 1.25rem;
        border-radius: 9999px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        background: var(--accent);
        color: #0b0f1a;
        box-shadow: 0 0 0 1px rgba(182, 35, 215, 0.4),
          0 10px 25px rgba(0, 0, 0, 0.7);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      button[type="submit"]:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.8);
      }

      button[disabled] {
        opacity: 0.65;
        cursor: not-allowed;
        box-shadow: none;
      }

      .created-list {
        border-top: 1px solid var(--edge);
        padding-top: 1.25rem;
      }

      .created-list h2 {
        margin-bottom: 0.75rem;
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
        background: radial-gradient(
            600px 200px at -10% -60%,
            rgba(182, 35, 215, 0.1),
            transparent 60%
          ),
          #020617;
      }

      .created-list h3 {
        margin: 0 0 0.25rem;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0 0 0.35rem;
        font-size: 0.85rem;
        color: var(--muted);
      }

      .meta-small {
        margin: 0.25rem 0 0;
        font-size: 0.85rem;
        color: var(--muted);
      }

      .description {
        margin: 0;
      }

      .pill {
        padding: 0.15rem 0.6rem;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        background: rgba(15, 23, 42, 0.85);
      }

      .created-list.empty {
        text-align: left;
        color: var(--muted);
      }
    `,
  ],
})
export class CreateGuildComponent implements OnInit {
  model: Guild = {
    guildName: "",
    description: "",
    type: "",
    notificationPreference: "Email",
    acceptTerms: false,
  };

  createdGuilds: Guild[] = [];

  constructor(private guildService: GuildService) {}

  ngOnInit(): void {
    // Load any guilds from this session (or previous navigations)
    this.createdGuilds = this.guildService.getGuilds();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const guildToAdd: Guild = { ...this.model };

    // Store in the shared service (and sessionStorage)
    this.guildService.addGuild(guildToAdd);
    this.createdGuilds = this.guildService.getGuilds();

    // reset model back to defaults
    this.model = {
      guildName: "",
      description: "",
      type: "",
      notificationPreference: "Email",
      acceptTerms: false,
    };

    form.resetForm(this.model);
  }
}
