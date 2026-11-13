(function () {
  "use strict";
  // Static markup for the 'rpg-demo' page.
  function render() {
    const isFile = window.location.protocol === "file:";
    const html = `<!-- src/app/pages/rpg-demo/rpg-demo.component.html -->
  <section class="rpg-demo">
    <header class="rpg-demo__header">
      <h1>RPG Character Maker Demo</h1>
      <p>
        Full Angular SPA running inside an iframe. Built with routing, reactive
        forms, and TypeScript services to manage players and characters. The source
        is in the <code>rpg-character-maker</code> folder of this repo.<br />
        Use the credentials below to log in:<br />
        User Name: admin<br />
        Password: admin123
      </p>

      <a
        href="assets/rpg-demo/index.html"
        target="_blank"
        rel="noopener noreferrer"
        class="rpg-demo__open-link">
        Open full-screen in new tab
      </a>
    </header>

    <div class="rpg-demo__frame-wrapper">
      <iframe
        class="rpg-demo__frame"
        src="assets/rpg-demo/index.html"
        title="RPG Character Maker Demo"></iframe>
    </div>
  </section>`;
    if (!isFile) return html;
    // The Angular demo is built as ES modules, which browsers block on file://.
    return html.replace(/<div class="rpg-demo__frame-wrapper">[\s\S]*?<\/iframe>\s*<\/div>/,
      `<p class="rpg-demo__notice">The Angular demo needs a web server to run. Use <code>npm start</code> and open http://localhost:4200, or view the live site.</p>`);
  }

  (window.Pages = window.Pages || {})["rpg-demo"] = { render };
})();
