// Accessibility checks that can run without a browser: color contrast of the
// theme colors, and the presence of the focus, skip-link and reduced-motion CSS.
//   npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const styles = read("css/styles.css");
const demos = read("css/demos.css");

// ---- WCAG 2 contrast math
const rgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = (fg, alpha, bg) =>
  "#" +
  rgb(fg)
    .map((v, i) => Math.round(v * alpha + rgb(bg)[i] * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("");

// Read the theme variables from :root so the test follows the real values.
const vars = {};
for (const m of styles.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) vars[m[1]] = m[2];

// Lightest backgrounds the text can sit on (worst case for light text).
const BODY_LIGHTEST = "#2b1644"; // top-left of the page gradient
const CARD_LIGHTEST = blend("#b99ac5", 0.16, "#020617"); // top-left of a card
const AA = 4.5;

const atLeast = (name, value, min = AA) =>
  assert.ok(value >= min, `${name}: contrast ${value.toFixed(2)}:1 is below ${min}:1`);

test("theme variables are present", () => {
  for (const name of ["text-main", "text-muted", "link", "link-visited", "btn-end", "accent-purple"]) {
    assert.ok(vars[name], `--${name} is missing from :root`);
  }
});

test("base text color is readable on the page and on cards", () => {
  atLeast("--text-main on page", ratio(vars["text-main"], BODY_LIGHTEST));
  atLeast("--text-main on card", ratio(vars["text-main"], CARD_LIGHTEST));
  atLeast("--text-muted on page", ratio(vars["text-muted"], BODY_LIGHTEST));
});

test("link colors are readable, unvisited and visited", () => {
  atLeast("--link", ratio(vars.link, BODY_LIGHTEST));
  atLeast("--link visited", ratio(vars["link-visited"], BODY_LIGHTEST));
  atLeast("--link on panel", ratio(vars.link, "#0b0d1c"));
});

test("gradient buttons keep light text readable along the whole gradient", () => {
  atLeast("text on --accent-purple", ratio("#f9fafb", vars["accent-purple"]));
  atLeast("text on --btn-end", ratio("#f9fafb", vars["btn-end"]));
});

test("highlight gradients (hero words and Home card titles) are readable on cards", () => {
  for (const name of ["highlight-gradient", "card-title-gradient"]) {
    const m = new RegExp(`--${name}:\\s*linear-gradient\\(([^;]+)\\);`).exec(styles);
    assert.ok(m, `--${name} is missing`);
    const stops = m[1].match(/#[0-9a-fA-F]{6}/g);
    assert.ok(stops && stops.length >= 2, `--${name}: expected hex color stops`);
    for (const stop of stops) {
      atLeast(`--${name} stop ${stop} on card`, ratio(stop, CARD_LIGHTEST));
      atLeast(`--${name} stop ${stop} on page`, ratio(stop, BODY_LIGHTEST));
    }
  }
  assert.match(styles, /\[data-page="home"\] \.card h3\s*\{[^}]*var\(--card-title-gradient\)/, "Home card titles should use the card gradient");
});
test("no gradient button runs into the light soft purple", () => {
  const bad = /linear-gradient\([^)]*var\(--soft-purple\)\)/;
  assert.doesNotMatch(styles, bad, "styles.css has a gradient ending in --soft-purple");
  assert.doesNotMatch(demos, bad, "demos.css has a gradient ending in --soft-purple");
});

test("demo placeholder color is readable on the input background", () => {
  const m = /::placeholder\s*\{\s*color:\s*(#[0-9a-fA-F]{6})/.exec(demos);
  assert.ok(m, "demos.css should set a ::placeholder color");
  atLeast("placeholder on input", ratio(m[1], "#0b1220"));
});

test("the page does not rely on the browser's default dark text color", () => {
  const body = /body\s*\{[^}]*color:\s*var\(--text-main\)/.exec(styles);
  assert.ok(body, "body should use --text-main");
});

test("skip link, focus ring and reduced-motion rules exist", () => {
  assert.match(styles, /a\.sr-only:focus/, "skip link should become visible on focus");
  assert.match(styles, /:focus-visible\s*\{[^}]*outline:/, "global focus ring is missing");
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/, "reduced-motion rule is missing");
});

test("unclassed links get the link color without overriding buttons", () => {
  assert.match(styles, /:where\(a:not\(\[class\]\)\)\s*\{[^}]*color:\s*var\(--link\)/);
});

test("repeated link labels carry screen-reader context", () => {
  for (const file of ["js/pages/home.js", "js/pages/projects.js"]) {
    const src = read(file);
    for (const m of src.matchAll(/<a [^>]*class="btn btn-ghost"[^>]*>([^<]*)(<span class="sr-only">[^<]*<\/span>)?<\/a>/g)) {
      const label = m[1].trim();
      if (/^(Try the demo|View demo|View source)$/.test(label)) {
        assert.ok(m[2], `${file}: "${label}" link needs hidden context text`);
      }
    }
  }
});
