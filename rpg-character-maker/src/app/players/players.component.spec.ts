import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PlayersComponent } from "./players.component";
import { CharacterService, Character } from "../shared/character.service";
import { GuildService, Guild } from "../shared/guild.service";

describe("PlayersComponent", () => {
  let fixture: ComponentFixture<PlayersComponent>;
  let component: PlayersComponent;

  // Mock data
  const mockCreatedCharacters: Character[] = [
    {
      name: "Lissa",
      gender: "Female",
      class: "Wizard",
      faction: "Moonlit Order",
      startingLocation: "Silverkeep",
      funFact: "Collects enchanted quills",
      guildName: "Code Mages",
    },
  ];

  const mockGuilds: Guild[] = [
    {
      guildName: "Code Mages",
      description: "A guild of spell-casting developers.",
      type: "Casual",
      notificationPreference: "Email",
      acceptTerms: true,
    },
  ];

  // Mock services
  let mockCharacterService: Partial<CharacterService>;
  let mockGuildService: jasmine.SpyObj<GuildService>;

  beforeEach(async () => {
    mockCharacterService = {
      premadeCharacters: new Array(10).fill({
        name: "Example",
        gender: "Male",
        class: "Fighter",
        faction: "Alliance",
        startingLocation: "Town",
        funFact: "Likes swords",
      }),
      createdCharacters: mockCreatedCharacters,
    };

    mockGuildService = jasmine.createSpyObj<GuildService>("GuildService", [
      "getGuilds",
    ]);

    mockGuildService.getGuilds.and.returnValue(mockGuilds);

    await TestBed.configureTestingModule({
      imports: [PlayersComponent],
      providers: [
        { provide: CharacterService, useValue: mockCharacterService },
        { provide: GuildService, useValue: mockGuildService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ========================================================
  // PREVIOUSLY REQUIRED TESTS
  // ========================================================

  it("should create PlayersComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should render a list of at least 10 characters", () => {
    const cards = fixture.nativeElement.querySelectorAll(".card");
    expect(cards.length).toBeGreaterThanOrEqual(10);
  });

  // ========================================================
  // TESTS REQUIRED FOR HANDS-ON 7.1
  // ========================================================

  it("should display created characters correctly", () => {
    const createdCards = fixture.debugElement.queryAll(
      By.css(".created-characters .card")
    );
    expect(createdCards.length).toBe(1);

    const badgeText = createdCards[0].query(By.css(".badge")).nativeElement
      .textContent;

    expect(badgeText).toContain("Lissa");
    expect(badgeText).toContain("Wizard");
  });

  it("should display created guilds correctly", () => {
    const rows = fixture.debugElement.queryAll(
      By.css(".guilds-section table tbody tr")
    );
    expect(rows.length).toBe(1);

    const cells = rows[0].queryAll(By.css("td"));

    expect(cells[0].nativeElement.textContent.trim()).toBe("Code Mages");
    expect(cells[1].nativeElement.textContent.trim()).toContain(
      "spell-casting developers"
    );
    expect(cells[2].nativeElement.textContent.trim()).toBe("Casual");
    expect(cells[3].nativeElement.textContent.trim()).toBe("Email");
    expect(cells[4].nativeElement.textContent.trim()).toBe("Yes");
  });

  it("should show placeholder text when no guilds exist", () => {
    mockGuildService.getGuilds.and.returnValue([]);
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(
      By.css(".guilds-section .placeholder")
    );

    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent.trim()).toBe(
      "No guilds have been created yet."
    );
  });

  it("should show placeholder text when no created characters exist", () => {
    (mockCharacterService as any).createdCharacters = [];
    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(
      By.css(".created-characters .placeholder")
    );

    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent.trim()).toBe(
      "No created characters yet. Visit the Character Creator to add one!"
    );
  });
});
