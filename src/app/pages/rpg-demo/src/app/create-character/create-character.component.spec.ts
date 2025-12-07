import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { CreateCharacterComponent } from "./create-character.component";
import { CharacterService, Character } from "../shared/character.service";
import { GuildService } from "../shared/guild.service";

describe("CreateCharacterComponent", () => {
  let component: CreateCharacterComponent;
  let fixture: ComponentFixture<CreateCharacterComponent>;
  let characterServiceSpy: jasmine.SpyObj<CharacterService>;
  let guildServiceStub: Partial<GuildService>;

  beforeEach(async () => {
    characterServiceSpy = jasmine.createSpyObj<CharacterService>(
      "CharacterService",
      ["addCharacter"],
      {
        // optional: createdCharacters backing field
        createdCharacters: [],
      }
    );

    guildServiceStub = {
      getGuilds: () => [],
    } as Partial<GuildService>;

    await TestBed.configureTestingModule({
      imports: [CreateCharacterComponent, FormsModule],
      providers: [
        { provide: CharacterService, useValue: characterServiceSpy },
        { provide: GuildService, useValue: guildServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the model with default values", () => {
    const expected: Character = {
      name: "",
      gender: "Male",
      class: "Fighter",
      faction: "",
      startingLocation: "",
      funFact: "",
      guildName: "",
    };

    expect(component["model"]).toEqual(expected);
  });

  it("should not add a character when the form is invalid", () => {
    const fakeForm: any = {
      invalid: true,
      resetForm: jasmine.createSpy("resetForm"),
    };

    component.onSubmit(fakeForm);

    expect(characterServiceSpy.addCharacter).not.toHaveBeenCalled();
    expect(fakeForm.resetForm).not.toHaveBeenCalled();
  });

  it("should add a character and reset the form when valid", () => {
    // Arrange: set up a valid model
    component["model"] = {
      name: "Lissa",
      gender: "Female",
      class: "Wizard",
      faction: "Moonlit Order",
      startingLocation: "Silverkeep",
      funFact: "Collects enchanted quills",
      guildName: "Code Mages",
    };

    const fakeForm: any = {
      invalid: false,
      resetForm: jasmine.createSpy("resetForm"),
    };

    // Act
    component.onSubmit(fakeForm);

    // Assert addCharacter called with full model INCLUDING guildName
    expect(characterServiceSpy.addCharacter).toHaveBeenCalledTimes(1);
    expect(characterServiceSpy.addCharacter).toHaveBeenCalledWith({
      name: "Lissa",
      gender: "Female",
      class: "Wizard",
      faction: "Moonlit Order",
      startingLocation: "Silverkeep",
      funFact: "Collects enchanted quills",
      guildName: "Code Mages",
    });

    // Assert model reset to defaults (including guildName: "")
    const expectedResetModel: Character = {
      name: "",
      gender: "Male",
      class: "Fighter",
      faction: "",
      startingLocation: "",
      funFact: "",
      guildName: "",
    };

    expect(component["model"]).toEqual(expectedResetModel);
    expect(fakeForm.resetForm).toHaveBeenCalledWith(expectedResetModel);
  });
});
