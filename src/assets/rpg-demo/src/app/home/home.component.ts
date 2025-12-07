import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: true,
  template: `
    <section class="hero">
      <img
        class="hero-img"
        src="assets/RPG-HeroBanner.png"
        alt="Heroic party looking over a valley with a dragon silhouette"
      />
      <div class="hero-copy">
        <h2>Forge a Legend Worth Telling</h2>
        <p class="lead">
          Welcome to the RPG Character Maker—your anvil, quill, and spellbook in
          one place. Whether you’re new to tabletop adventures or a seasoned
          game master, this creative tool helps you shape heroes who truly feel
          alive: curious novices, tenacious veterans, mysterious scholars, and
          brash treasure-hunters with hearts of gold.
        </p>
        <p>
          Begin with the foundations that define identity: ancestry, class,
          background, and temperament. Each choice offers mechanical depth and
          narrative hooks. Will you walk the battlefield as a stalwart guardian,
          or study the stars to bargain with unseen powers? Perhaps you’re a
          silver-tongued wanderer who can turn a duel into a dance and an enemy
          into an ally. Our presets get you started quickly, and our advanced
          editors let you tune the tiniest details—from attribute arrays and
          saving throws to proficiencies and favored instruments. You can
          preview how choices affect combat roles, skill coverage, and party
          synergy, so your group feels complete before the first die is cast.
        </p>
        <p>
          We designed this maker with campaigns in mind. Save multiple detailed
          versions of a character as their story evolves: early-level scrapper,
          mid-tier expert, and capstone legend. You can tag each snapshot with
          session notes, memorable quotes, and important loot trackers. Build
          with intention, but leave room for surprises—the best stories come
          from imperfect plans, unexpected crits, and trusted friends who say
          “trust me” right before opening the ominous door. When you’re ready,
          export a polished sheet or share a read-only link with your party.
          Your next adventure truly starts here—let’s make someone
          unforgettable.
        </p>
      </div>
    </section>

    <section class="highlights">
      <figure class="card">
        <img
          src="assets/ClassesGrid.png"
          alt="Grid of character classes: fighter, rogue, wizard, bard, druid"
        />
        <figcaption>
          Pick a path—martial mastery, subtlety and shadow, arcane scholarship,
          silver-tongued song, or the old magic of root and claw. Each class
          comes with distinct features and milestones.
        </figcaption>
      </figure>

      <figure class="card">
        <img
          src="assets/DiceSet.png"
          alt="Polyhedral dice set scattered across a leather journal"
        />
        <figcaption>
          See stats update in real time as you allocate attributes or roll
          arrays; pin your favorite spreads and compare expected outcomes.
        </figcaption>
      </figure>

      <figure class="card">
        <img
          src="assets/WorldMap.png"
          alt="Fantasy world map with regions, seas, and trade routes"
        />
        <figcaption>
          Tie your background to the world—homelands, guilds, and rival factions
          become story fuel that the GM can weave into quests.
        </figcaption>
      </figure>
    </section>
  `,
  styles: [
    `
      /* Optional web fonts (remove if offline)
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;600;800&family=Fira+Code:wght@400;600&display=swap');
    */
      :host {
        display: block;
      }
      .hero {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: 2rem;
        align-items: center;
        background: linear-gradient(
          180deg,
          rgba(182, 35, 215, 0.12),
          transparent 50%
        );
        padding: 2rem 0 1rem;
      }
      .hero-img {
        width: 100%;
        height: auto;
        border-radius: 1rem; /* soft rounded corners */
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 8px 12px 24px rgba(0, 0, 0, 0.6),
          /* main shadow down-right */ 0 0 35px rgba(182, 35, 215, 0.25); /* faint purple glow */
        transition: box-shadow 0.4s ease, transform 0.3s ease;
      }

      .hero-img:hover {
        transform: translateY(-4px); /* slight lift on hover */
        box-shadow: 0 8px 24px rgba(182, 35, 215, 0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .hero-copy h2 {
        font-family: "Merriweather", Georgia, serif;
        margin: 0 0 0.35rem;
        font-size: clamp(1.6rem, 2.4vw, 2.2rem);
        text-shadow: 0 0 18px rgba(182, 35, 215, 0.2);
      }
      .lead {
        font-family: Inter, system-ui, Arial, sans-serif;
        font-weight: 600;
        color: #e5e7eb;
      }
      .hero-copy p {
        color: #cbd5e1;
      }

      .highlights {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
        margin-top: 2rem;
      }
      .card {
        background: #111827;
        border: 1px solid #1f2937;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(182, 35, 215, 0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
      }
      .card img {
        display: block;
        width: 100%;
        height: auto;
      }
      .card figcaption {
        padding: 0.9rem 1rem 1.1rem;
        color: #d1d5db;
        font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas,
          monospace;
        font-size: 0.95rem;
      }

      @media (max-width: 960px) {
        .hero {
          grid-template-columns: 1fr;
        }
        .highlights {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 640px) {
        .highlights {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {}
