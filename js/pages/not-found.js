(function () {
  "use strict";
  // Static markup for the 'not-found' page.
  function render() {
    return `<section class="section" style="text-align: center; padding: 4rem 0;">
    <p class="hero-title" style="letter-spacing: 0.12em;">404</p>
    <p class="hero-text" style="margin-left: auto; margin-right: auto;">Oops! The page you’re looking for took a different node path.</p>
    <p class="hero-text" style="margin-left: auto; margin-right: auto;">Let’s get you back to the main page.</p>
    <a href="#/" class="btn btn-primary" style="margin-top: 1.5rem;">Return home</a>
  </section>`;
  }

  (window.Pages = window.Pages || {})["not-found"] = { render };
})();
