(function () {
  "use strict";
  // Static markup for the 'about' page.
  function render() {
    return `<section class="section split" aria-labelledby="about-title">
    <div class="panel">
      <h1 id="about-title">About Melissa</h1>
      <p>
        I’m Melissa Lutz, a West ROC Specialist IV at Spectrum (Cox Communications, formerly Charter Communications) and the
        developer behind <strong>Code By Lissa</strong>. I monitor network health,
        troubleshoot fiber and node events, and help agents respond quickly and confidently
        to outages.
      </p>
      <p>
        To support that work, I build automation tools and JavaScript apps that reduce
        repetitive tasks and standardize communication, and I use Angular when a project calls for it. Many of my projects
        started as “there has to be a better way” moments during a busy shift.
      </p>
      <p>
        Outside of the ROC, I’m a Bellevue University graduate (BS, Web Development, March 2026)
        and I keep sharpening my skills in JavaScript, Node.js, Angular, and DevOps. This portfolio brings together my
        school projects, ROC tools, and experiments under a single purple-themed brand.
      </p>
    </div>

    <aside class="panel" aria-label="Skills snapshot">
      <h2>Skills snapshot</h2>
      <ul>
        <li><strong>ROC IV:</strong> Fiber events, node approvals, repeat outages</li>
        <li><strong>Languages:</strong> JavaScript, TypeScript, HTML, CSS</li>
        <li><strong>Frameworks & runtimes:</strong> Angular, Node.js</li>
        <li><strong>Back end:</strong> Server-side JavaScript behind the ROC Note Tool</li>
        <li><strong>Automation:</strong> Excel/VBA task assignment tools</li>
        <li><strong>Tools:</strong> Git, GitHub, GitLab CI, VS Code</li>
      </ul>
    </aside>
  </section>`;
  }

  (window.Pages = window.Pages || {})["about"] = { render };
})();
