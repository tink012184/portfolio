// src/app/signin/signin.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../shared/auth.service";

@Component({
  selector: "app-signin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="signin">
      <h1>Sign In</h1>
      <p class="intro">Please sign in to access the RPG Character Creator.</p>

      <!-- Auth error (wrong username/password) -->
      <p class="auth-error" *ngIf="authError">
        {{ authError }}
      </p>

      <form [formGroup]="signinForm" (ngSubmit)="onSubmit()" novalidate>
        <!-- Username -->
        <div
          class="form-group"
          [class.has-error]="username?.invalid && username?.touched"
        >
          <label for="username">Username</label>
          <input id="username" type="text" formControlName="username" />
          <div class="error" *ngIf="username?.touched && username?.invalid">
            <span *ngIf="username?.errors?.['required']">
              Username is required.
            </span>
          </div>
        </div>

        <!-- Password -->
        <div
          class="form-group"
          [class.has-error]="password?.invalid && password?.touched"
        >
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" />
          <div class="error" *ngIf="password?.touched && password?.invalid">
            <span *ngIf="password?.errors?.['required']">
              Password is required.
            </span>
            <span *ngIf="password?.errors?.['minlength']">
              Password must be at least 4 characters.
            </span>
          </div>
        </div>

        <button type="submit" [disabled]="signinForm.invalid">Sign In</button>
      </form>
    </section>
  `,
  styles: [
    `
      .signin {
        max-width: 480px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .intro {
        margin-bottom: 1rem;
      }

      form {
        display: grid;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group.has-error input {
        border-color: #b91c1c;
        outline-color: #b91c1c;
      }

      label {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      input {
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

      .auth-error {
        margin-bottom: 1rem;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        background-color: #fee2e2;
        color: #991b1b;
        font-weight: 600;
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
    `,
  ],
})
export class SignInComponent implements OnInit {
  signinForm: FormGroup;
  authError = "";
  // 👇 default if no returnUrl is passed
  returnUrl = "/create-character";

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signinForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // 👇 read returnUrl from query string, fall back to create-character
    const fromQuery = this.route.snapshot.queryParamMap.get("returnUrl");
    if (fromQuery) {
      this.returnUrl = fromQuery;
    }
  }

  get username() {
    return this.signinForm.get("username");
  }

  get password() {
    return this.signinForm.get("password");
  }

  onSubmit(): void {
    this.authError = "";

    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.signinForm.value;

    // Attempt real login
    const success = this.auth.login(username, password);

    if (!success) {
      // ❌ Wrong creds: show error, do NOT navigate
      this.authError = "Invalid username or password.";
      // optional: clear just the password field
      this.password?.reset();
      return;
    }

    // ✅ Success: go back to the page the user wanted
    this.router.navigateByUrl(this.returnUrl);
  }
}
