import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgForm } from "@angular/forms";

import { CreateGuildComponent } from "./create-guild.component";
import { GuildService } from "../shared/guild.service";

describe("CreateGuildComponent", () => {
  let component: CreateGuildComponent;
  let fixture: ComponentFixture<CreateGuildComponent>;
  let guildService: GuildService;

  beforeEach(async () => {
    // Make sure we start with a clean session each test run
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CreateGuildComponent],
      providers: [GuildService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGuildComponent);
    component = fixture.componentInstance;
    guildService = TestBed.inject(GuildService);
    fixture.detectChanges();
  });

  it("should create the guild component", () => {
    expect(component).toBeTruthy();
  });

  it("should not allow submission when required fields are missing", () => {
    // Leave the model in its default, incomplete state
    component.model = {
      guildName: "",
      description: "",
      type: "",
      notificationPreference: "Email",
      acceptTerms: false,
    };

    fixture.detectChanges();

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    // 🚫 If the form is not filled out, the button should be disabled
    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBeTrue();

    // Also, no guilds should be added silently
    expect(component.createdGuilds.length).toBe(0);
    expect(guildService.getGuilds().length).toBe(0);
  });

  it("should add a guild when the form is valid and then reset the model and form", () => {
    const markAllAsTouchedSpy = jasmine.createSpy("markAllAsTouched");
    const resetFormSpy = jasmine.createSpy("resetForm");

    const fakeForm = {
      invalid: false,
      control: { markAllAsTouched: markAllAsTouchedSpy },
      resetForm: resetFormSpy,
    } as unknown as NgForm;

    // Fill out the model with valid data
    component.model = {
      guildName: "Moonlit Scholars",
      description:
        "An educational guild that runs lore nights and build clinics.",
      type: "Educational",
      notificationPreference: "InApp",
      acceptTerms: true,
    };

    // Call the submit handler
    component.onSubmit(fakeForm);

    // ✅ Guild should be added in the component AND the service
    expect(component.createdGuilds.length).toBe(1);
    expect(guildService.getGuilds().length).toBe(1);

    const created = component.createdGuilds[0];
    expect(created.guildName).toBe("Moonlit Scholars");
    expect(created.type).toBe("Educational");
    expect(created.notificationPreference).toBe("InApp");
    expect(created.acceptTerms).toBeTrue();

    // Form should have been reset with the default model
    expect(resetFormSpy).toHaveBeenCalledWith(component.model);
    expect(component.model).toEqual({
      guildName: "",
      description: "",
      type: "",
      notificationPreference: "Email",
      acceptTerms: false,
    });

    // No need to markAllAsTouched on a valid submission
    expect(markAllAsTouchedSpy).not.toHaveBeenCalled();
  });
});
