(function () {
  "use strict";
  // Static markup for the 'projects' page.
  function render() {
    return `<section class="section">
    <header style="margin-bottom: 1.5rem">
      <h1 class="section-title">Projects</h1>
      <p class="section-subtitle">
        JavaScript tools, an Angular showcase app, and ROC IV automations.
      </p>
    </header>

    <section class="project-category" aria-label="Web apps">
      <h2 class="section-title">Web apps</h2>
      <div class="card-grid">
        <!-- ✅ RPG CARD WITH EMBEDDED IFRAME -->
        <article class="card">
          <h3>RPG Character Maker (demo)</h3>
          <p class="hero-text">
            Angular SPA with routing and reactive forms that lets users manage
            players and characters with validation and strong typing.
          </p>

          <div class="hero-actions">
            <!-- Existing internal demo route -->
            <a href="#/rpg-demo" class="btn btn-ghost">View demo</a>
          </div>
        </article>

        <!-- ✅ Existing portfolio card unchanged -->
        <article class="card">
          <h3>Portfolio as vanilla JavaScript app</h3>
          <p class="hero-text">
            This site itself, built with vanilla JavaScript, a small hash router, and reusable page templates, with no framework or build step.
          </p>
        </article>
      </div>
    </section>

    <section class="project-category" aria-label="JS utilities">
      <h2 class="section-title">JavaScript tools</h2>
      <div class="card-grid">
        <article class="card">
          <h3>Text parsing helpers</h3>
          <p class="hero-text">
            Small plain JavaScript utilities to parse outage notes and map them into structured
            fields for faster form fills and documentation.
          </p>
        </article>
      </div>
    </section>

    <section id="roc-tools" class="project-category" aria-label="ROC tools">
      <h2 class="section-title">ROC IV automations</h2>
      <div class="card-grid">
        <article class="card">
          <h3>ROC Note Tool</h3>
          <p class="hero-text">
            JavaScript app with a server backend that streamlines fiber events,
            repeat outage documentation, and IRIS updates. Used by all four ROC
            teams.
          </p>
        </article>
        <article class="card">
          <h3>Outage Template (demo)</h3>
          <p class="hero-text">
            A working recreation of my outage-ticket helper: it calculates the repeat
            tier, parses pasted ping and SNR data into a breadcrumb, and builds
            copy-ready ticket notes. Uses fake data and made-up system names.
          </p>
          <div class="hero-actions">
            <a href="#/outage-template" class="btn btn-ghost">Try the demo</a>
          </div>
        </article>

        <article class="card">
          <h3>Repeat Outage Email Creator (demo)</h3>
          <p class="hero-text">
            A working recreation of my repeat-outage tool: pick the location, enter
            the outage counts, and it works out the tier, flags when no email is
            needed, and builds the recipients, subject and body. Uses fake data and
            made-up systems.
          </p>
          <div class="hero-actions">
            <a href="#/repeat-outage-template" class="btn btn-ghost">Try the demo</a>
          </div>
        </article>
      </div>
    </section>
  </section>`;
  }

  (window.Pages = window.Pages || {})["projects"] = { render };
})();
