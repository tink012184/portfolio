// Helpers shared by the demo pages. Loaded before the pages.
(function () {
  "use strict";

  /**
   * Repeat tier (1-4) from the number of unplanned outages in the last 24 hours
   * and the last 10 days (both including the current one). Returns null when the
   * counts are below the email threshold.
   */
  function pickTier(h24, h10) {
    const a = Number(h24) || 0;
    const b = Number(h10) || 0;
    if (b >= 9 || a >= 8) return 4;
    if (b === 8 || a === 7) return 3;
    if (b === 7 || a === 6) return 2;
    if (b === 6 || a === 5) return 1;
    return null;
  }

  /** Copy text to the clipboard. Resolves true on success, false on failure. */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for browsers or contexts without the async clipboard API
      // (for example a page opened from file://).
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  window.DemoShared = { pickTier, copyText };
})();
