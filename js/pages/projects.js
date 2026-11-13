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
          <h3>RPG Character Maker</h3>
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
          <h3>Fiber Event Template</h3>
          <p class="hero-text">
            Built in JavaScript. Guides agents through fiber event triage, collects the right details,
            and outputs a formatted summary to share with MTs and leadership.
          </p>
        </article>

        <article class="card">
          <h3>IRIS Documenter</h3>
          <p class="hero-text">
            Helper tool that turns key event details (ticket, node, impact, steps,
            status) into clean, consistent documentation agents can paste into
            IRIS/BP.
          </p>
          <div class="hero-actions">
            <a href="#/iris-documenter" class="btn btn-ghost">View mockup</a>
          </div>
        </article>
      </div>
    </section>
  </section>`;
  }

  (window.Pages = window.Pages || {})["projects"] = { render };
})();
