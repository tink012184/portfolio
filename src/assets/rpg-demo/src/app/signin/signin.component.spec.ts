import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SignInComponent } from "./signin.component";
import { AuthService } from "../shared/auth.service";
import { Router } from "@angular/router";
import { of } from "rxjs";

// Mock AuthService
class MockAuthService {
  login = jasmine.createSpy("login");
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy("navigate");
}

describe("SignInComponent", () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to /create-character on successful login", () => {
    // Arrange
    authService.login.and.returnValue(true);

    component.signinForm.setValue({
      username: "admin",
      password: "admin123",
    });

    // Act
    component.onSubmit();

    // Assert
    expect(authService.login).toHaveBeenCalledWith("admin", "admin123");
    expect(router.navigate).toHaveBeenCalledWith(["/create-character"]);
    expect(component.authError).toBe("");
  });

  it("should show an error and NOT navigate on invalid login", () => {
    // Arrange
    authService.login.and.returnValue(false);

    component.signinForm.setValue({
      username: "wrong",
      password: "creds",
    });

    // Act
    component.onSubmit();

    // Assert
    expect(authService.login).toHaveBeenCalledWith("wrong", "creds");
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.authError).toBe("Invalid username or password.");
  });
});
