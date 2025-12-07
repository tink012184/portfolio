import { Injectable } from "@angular/core";

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly STORAGE_KEY = "rpg-current-user";

  // Simple hard-coded user list for the assignment
  private readonly users: User[] = [
    { username: "admin", password: "admin123" },
    { username: "melissa", password: "wizard123" },
  ];

  private _isLoggedIn = false;
  private _currentUser: string | null = null;

  constructor() {
    // Restore session from sessionStorage if present
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.username) {
        this._isLoggedIn = true;
        this._currentUser = parsed.username;
      }
    }
  }

  /**
   * Attempts to log in with the given username and password.
   * Returns true on success, false on failure.
   */
  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      // ❌ invalid login
      this._isLoggedIn = false;
      this._currentUser = null;
      sessionStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem("loggedIn"); // keep old flag clean
      return false;
    }

    // ✅ valid login
    this._isLoggedIn = true;
    this._currentUser = user.username;

    sessionStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({ username: user.username })
    );
    // if anything else in your app checks this:
    sessionStorage.setItem("loggedIn", "true");

    return true;
  }

  logout(): void {
    this._isLoggedIn = false;
    this._currentUser = null;
    sessionStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem("loggedIn");
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get currentUser(): string | null {
    return this._currentUser;
  }
}
