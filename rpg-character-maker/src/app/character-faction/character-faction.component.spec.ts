// src/app/character-faction/character-faction.component.spec.ts
import { TestBed, ComponentFixture } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CharacterFactionComponent } from "./character-faction.component";

describe("CharacterFactionComponent", () => {
  let component: CharacterFactionComponent;
  let fixture: ComponentFixture<CharacterFactionComponent>;
  let httpMock: HttpTestingController;

  const API_URL = "http://localhost:3000/api/character-factions";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CharacterFactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFactionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --------------------------
  // TEST 1: Error Handling
  // --------------------------
  it("should handle errors when data is not found", () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(API_URL);
    req.flush("Error", { status: 404, statusText: "Not Found" });

    expect(component.errorMessage).toContain(
      "Unable to load character factions"
    );
    expect(component.characterFactions.length).toBe(0);
  });

  // --------------------------
  // TEST 2: Should fetch factions
  // --------------------------
  it("should correctly fetch a list of character factions", () => {
    const mockData = [
      { name: "Alliance", description: "Strong and noble faction" },
      { name: "Horde", description: "Savage and honorable faction" },
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne(API_URL);
    req.flush(mockData);

    expect(component.characterFactions.length).toBe(2);
    expect(component.characterFactions[0].name).toBe("Alliance");
  });

  // --------------------------
  // TEST 3: Should update DOM
  // --------------------------
  it("should update the characterFactions div when factions are found", () => {
    const mockData = [{ name: "Mages Guild", description: "Magic users" }];

    fixture.detectChanges();

    const req = httpMock.expectOne(API_URL);
    req.flush(mockData);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector("#characterFactions ul");

    expect(list).toBeTruthy();
    expect(list?.textContent).toContain("Mages Guild");
  });
});
