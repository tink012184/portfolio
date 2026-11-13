(function () {
  "use strict";
  // Static markup for the 'home' page.
  function render() {
    return `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-grid">
      <div>
        <div class="hero-badges">
          <span class="hero-badge">Hi, I’m Melissa – ROC IV & Web Dev</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          Building tools that keep <span class="hero-highlight">networks healthy</span> and
          <span class="hero-highlight">teams efficient</span>.
        </h1>

        <p class="hero-text">
          I’m a West ROC Specialist IV at Spectrum (Cox Communications) and a full-stack web
          developer. I design automation tools and JavaScript apps that make troubleshooting
          faster and workflows smoother, and I build in Angular too.
        </p>

        <div class="hero-actions">
          <a href="#/projects" class="btn btn-primary">
            View projects <span aria-hidden="true">→</span>
          </a>
          <a href="#/resume" class="btn btn-ghost">View resume</a>
        </div>
      </div>

      <aside class="panel" aria-label="Featured work">
        <h2 class="section-title">Featured work</h2>
        <ul style="list-style: none; padding: 0; margin-top: 0.75rem;">
          <li class="hero-text" style="font-size: 0.85rem; margin-bottom: 0.6rem;">
            <strong>ROC Note Tool</strong> – JavaScript app with a server backend that streamlines
            fiber events, repeat outage documentation, and IRIS updates for all four ROCs.
          </li>
          <li class="hero-text" style="font-size: 0.85rem; margin-bottom: 0.6rem;">
            <strong>Outage Template (demo)</strong> – Working recreation of an outage-ticket helper:
            repeat tiers, node breadcrumbs, and copy-ready notes, all with fake data.
          </li>
          <li class="hero-text" style="font-size: 0.85rem;">
            <strong>RPG Character Maker (demo)</strong> – Angular SPA showcasing reactive forms,
            routing, and services.
          </li>
        </ul>
      </aside>
    </div>
  </section>

  <section class="section" aria-labelledby="featured-title">
    <div class="section-heading">
      <div>
        <h2 id="featured-title" class="section-title">Featured projects</h2>
        <p class="section-subtitle">
          A quick snapshot of the work I’m most excited about right now.
        </p>
      </div>
      <a href="#/projects" class="btn btn-ghost">
        See all projects <span aria-hidden="true">↗</span>
      </a>
    </div>

    <div class="card-grid">
      <article class="card">
        <h3>ROC Note Tool</h3>
        <p class="hero-text">
          JavaScript app with a server backend that streamlines fiber events, repeat outage
          documentation, and IRIS updates for all four ROC teams.
        </p>
      </article>
      <article class="card">
        <h3>Outage Template (demo)</h3>
        <p class="hero-text">
          Try a working recreation of my outage-ticket helper, built with fake data.
        </p>
      </article>
      <article class="card">
        <h3>RPG Character Maker (demo)</h3>
        <p class="hero-text">
          Angular SPA with reactive forms and routing for players and characters.
        </p>
      </article>
    </div>
  </section>`;
  }

  (window.Pages = window.Pages || {})["home"] = { render };
})();
