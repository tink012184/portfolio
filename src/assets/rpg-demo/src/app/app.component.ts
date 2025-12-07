import { Component } from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "./shared/auth.service";
import { CharacterService } from "./shared/character.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ["./app.component.css"],
  template: `
    <header class="site-header">
      <div class="container header-inner">
        <div class="branding">
          <div class="logo-mark"></div>
          <div>
            <h1 class="title">🛡️{{ title }}</h1>
          </div>
        </div>

        <nav class="nav">
          <ul>
            <!-- HOME: always public -->
            <li>
              <a routerLink="/home" routerLinkActive="active">Home</a>
            </li>

            <!-- PLAYERS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/players' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/players' }
                "
                routerLinkActive="active"
              >
                Players
              </a>
            </li>

            <!-- CHARACTERS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/create-character' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/create-character' }
                "
                routerLinkActive="active"
              >
                Characters
              </a>
            </li>

            <!-- GUILDS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/create-guild' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/create-guild' }
                "
                routerLinkActive="active"
              >
                Guilds
              </a>
            </li>

            <!-- FACTIONS -->
            <li>
              <a
                [routerLink]="
                  auth.isLoggedIn ? '/character-faction' : '/signin'
                "
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/character-faction' }
                "
                routerLinkActive="active"
              >
                Factions
              </a>
            </li>
          </ul>
        </nav>

        <!-- 🔐 Sign in / Sign out buttons (back again!) -->
        <div class="auth-actions">
          <!-- Show Sign In when NOT logged in -->
          <button
            *ngIf="!auth.isLoggedIn"
            class="btn-small"
            routerLink="/signin"
          >
            Sign In
          </button>

          <!-- Show Sign Out when logged in -->
          <button *ngIf="auth.isLoggedIn" class="btn-small" (click)="logout()">
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <main class="page-main">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>© {{ year }} {{ title }}</span>

        <nav class="nav nav-footer">
          <ul>
            <!-- HOME is always public -->
            <li>
              <a routerLink="/home">Home</a>
            </li>

            <!-- PLAYERS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/players' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/players' }
                "
              >
                Players
              </a>
            </li>

            <!-- CHARACTERS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/create-character' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/create-character' }
                "
              >
                Characters
              </a>
            </li>

            <!-- GUILDS -->
            <li>
              <a
                [routerLink]="auth.isLoggedIn ? '/create-guild' : '/signin'"
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/create-guild' }
                "
              >
                Guilds
              </a>
            </li>

            <!-- FACTIONS -->
            <li>
              <a
                [routerLink]="
                  auth.isLoggedIn ? '/character-faction' : '/signin'
                "
                [queryParams]="
                  auth.isLoggedIn ? null : { returnUrl: '/character-faction' }
                "
              >
                Factions
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  `,
})
export class AppComponent {
  title = "RPG Character Builder";
  year = new Date().getFullYear();
  constructor(
    public auth: AuthService,
    private router: Router,
    private characterService: CharacterService
  ) {}

  // Used in the template
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  logout(): void {
    this.auth.logout();
    this.characterService.clearCharacters();
    this.router.navigate(["/signin"]);
  }
}
