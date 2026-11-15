// Unit tests for the demo logic and site wiring. No dependencies: run with
//   npm test        (uses Node's built-in test runner)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

// Run a browser script in a sandbox that only provides `window`. The scripts
// touch the DOM only inside functions that these tests never call.
function loadScripts(files) {
  const win = {};
  const context = vm.createContext({ window: win, console });
  for (const file of files) vm.runInContext(read(file), context, { filename: file });
  return win;
}

const PAGE_FILES = [
  "home", "about", "resume", "projects", "outage", "repeat-outage", "rpg-demo", "not-found",
].map((n) => `js/pages/${n}.js`);

const win = loadScripts(["js/shared.js", ...PAGE_FILES]);
const { pickTier } = win.DemoShared;
const outage = win.Pages.outage.logic;
const repeat = win.Pages["repeat-outage"].logic;

// ---------------------------------------------------------------- tiers
test("pickTier: below threshold returns null", () => {
  assert.equal(pickTier(1, 1), null);
  assert.equal(pickTier(4, 5), null);
  assert.equal(pickTier(0, 0), null);
  assert.equal(pickTier("", ""), null);
});

test("pickTier: 24 hour thresholds", () => {
  assert.equal(pickTier(5, 1), 1);
  assert.equal(pickTier(6, 1), 2);
  assert.equal(pickTier(7, 1), 3);
  assert.equal(pickTier(8, 1), 4);
});

test("pickTier: 10 day thresholds", () => {
  assert.equal(pickTier(1, 6), 1);
  assert.equal(pickTier(1, 7), 2);
  assert.equal(pickTier(1, 8), 3);
  assert.equal(pickTier(1, 9), 4);
});

test("pickTier: the higher of the two counts wins", () => {
  assert.equal(pickTier(5, 9), 4);
  assert.equal(pickTier(8, 6), 4);
  assert.equal(pickTier(6, 6), 2);
  assert.equal(pickTier(7, 6), 3);
});

test("pickTier: accepts the string values a <select> returns", () => {
  assert.equal(pickTier("6", "1"), 2);
  assert.equal(pickTier("1", "9"), 4);
});

test("both demos use the same tier function", () => {
  assert.equal(outage.pickTier, pickTier);
  assert.equal(repeat.pickTier, pickTier);
});

test("repeatTypeForCounts maps counts to the matching option text", () => {
  assert.equal(outage.repeatTypeForCounts(5, 1), "Tier 1:5 unplanned outages in 1 calendar day");
  assert.equal(outage.repeatTypeForCounts(1, 6), "Tier 1:6 unplanned outages in 10 calendar days");
  assert.equal(outage.repeatTypeForCounts(7, 1), "Tier 3:7 unplanned outages in 1 calendar day");
  assert.equal(outage.repeatTypeForCounts(8, 1), "Tier 4:8+ unplanned outages in 1 calendar day");
  assert.equal(outage.repeatTypeForCounts(1, 9), "Tier 4:9+ unplanned outages in 10 calendar days");
  assert.equal(outage.repeatTypeForCounts(2, 3), "");
});

// ---------------------------------------------------------------- ping parsing
const node = (name, rows, power) =>
  [
    `Node ${name}`,
    "Ping Statistics",
    "Type Online Offline Total Unknown",
    ...rows,
    "POWER SUPPLY",
    "Name Status",
    power,
  ].join("\n");

const ROWS_A = [
  "MTA 41.30% 232 395 0",
  "Set-top Box 38.00% 124 200 0",
  "Cable Modem 40.10% 180 301 2",
  "ONU 0.00% 0 0 0",
];

test("extractNodeData: sums device rows and computes percent offline", () => {
  const [n] = outage.extractNodeData(node("DEMO-204B", ROWS_A, "PS-1 Standby"));
  assert.equal(n.name, "DEMO-204B");
  assert.equal(n.offline, 536); // 232 + 124 + 180
  assert.equal(n.total, 896); // 395 + 200 + 301
  assert.match(n.percent, /^59[.,]82\s?%$/);
  assert.equal(n.powerSupply, "Standby");
});

test("extractNodeData: reads several nodes from one paste", () => {
  const paste = [
    node("DEMO-204B", ROWS_A, "PS-1 Standby"),
    "",
    node("DEMO-205A", ["MTA 55.00% 140 311 0", "Cable Modem 54.20% 120 262 0", "ONU 0.00% 0 0 0", "Set-top Box 52.40% 90 189 0"], "PS-2 Offline"),
  ].join("\n");
  const nodes = outage.extractNodeData(paste);
  // Spread into this realm: arrays built inside the vm sandbox have another prototype.
  assert.deepEqual([...nodes.map((n) => n.name)], ["DEMO-204B", "DEMO-205A"]);
  assert.equal(nodes[1].powerSupply, "Offline");
  assert.equal(nodes[1].offline, 350);
});

test("extractNodeData: power supply states", () => {
  const power = (line) => outage.extractNodeData(node("DEMO-1", ROWS_A, line))[0].powerSupply;
  assert.equal(power("PS-1 Online"), "Online");
  assert.equal(power("PS-1 Standby"), "Standby");
  assert.equal(power("PS-1 Offline"), "Offline");
  assert.equal(power("No results."), "N/A");
});

test("extractNodeData: empty or too-short input yields no nodes", () => {
  assert.equal(outage.extractNodeData("").length, 0);
  assert.equal(outage.extractNodeData("   ").length, 0);
  assert.equal(outage.extractNodeData("Node DEMO-1\nMTA 1% 1 1 1").length, 0);
});

// ---------------------------------------------------------------- SNR parsing
test("extractLowestSnr: picks the lowest reading and ignores the header", () => {
  const snr = [
    "Interface Frequency SNR",
    "ofdma-channel48:0/0/0 41.1 Mhz - 87.9 Mhz 43.20 dB",
    "us-log-channel48:0/0/0.0 22.0 Mhz - 28.4 Mhz 38.55 dB",
    "us-log-channel48:0/0/0.1 28.4 Mhz - 34.8 Mhz 39.10 dB",
  ].join("\n");
  assert.equal(outage.extractLowestSnr(snr), "38.55 dB");
});

test("extractLowestSnr: ignores 0 dB channels and handles no data", () => {
  assert.equal(outage.extractLowestSnr("chan-1 0 dB\nchan-2 40.00 dB"), "40.00 dB");
  assert.equal(outage.extractLowestSnr("chan-1 0 dB"), "N/A");
  assert.equal(outage.extractLowestSnr(""), "N/A");
});

// ---------------------------------------------------------------- email builder
const FORM = {
  region: "North Region",
  market: "Lakeside Market",
  hub: "Cedar Flats Hub",
  node: "DEMO-204B",
  power: "online",
  inc: "INC-DEMO-0002",
  tech: "Priya Shah",
  techEmail: "priya.shah@example.com",
  ssa: "6",
  unplanned: "6",
  y6: "",
  summary: "Line one.\nLine two.",
  order: "DEMO-2002",
};

test("buildEmail: subject, recipients and cc", () => {
  const email = repeat.buildEmail(FORM, 2);
  assert.equal(
    email.subject,
    "Tier 2 - Repeat Outage! North Region -> Lakeside Market - Cedar Flats Hub -> DEMO-204B"
  );
  assert.equal(
    email.to,
    "ops-center-north-region@example.com; escalation-lakeside-market-t2@example.com; priya.shah@example.com"
  );
  assert.equal(email.cc, "ops-managers@example.com");
});

test("buildEmail: body defaults Y6 to 0 and flattens the summary", () => {
  const { body } = repeat.buildEmail(FORM, 2);
  assert.match(body, /Number of Y6's in last 10 Days: 0/);
  assert.match(body, /Summary of findings: Line one\. Line two\./);
  assert.match(body, /WorkBoard order: DEMO-2002/);
});

test("buildEmail: leaves out the tech address when none is entered", () => {
  const email = repeat.buildEmail({ ...FORM, techEmail: "" }, 3);
  assert.equal(email.to.split("; ").length, 2);
  assert.ok(email.subject.startsWith("Tier 3"));
});

// ---------------------------------------------------------------- site wiring
test("every route has a page script and a registered page", () => {
  const routeNames = [...read("js/main.js").matchAll(/page\("([\w-]+)"/g)].map((m) => m[1]);
  const html = read("index.html");
  assert.ok(routeNames.length >= 7, "expected the route table to be found");
  for (const name of routeNames) {
    assert.ok(win.Pages[name], `no page registered for route "${name}"`);
    assert.ok(typeof win.Pages[name].render === "function", `${name} has no render()`);
    assert.ok(html.includes(`js/pages/${name}.js`), `index.html does not load js/pages/${name}.js`);
  }
});

test("index.html loads shared.js before the pages", () => {
  const html = read("index.html");
  assert.ok(html.indexOf("js/shared.js") !== -1);
  assert.ok(html.indexOf("js/shared.js") < html.indexOf("js/pages/outage.js"));
  assert.ok(html.indexOf("js/shared.js") < html.indexOf("js/pages/repeat-outage.js"));
});

test("page markup has no leftover Angular syntax or mojibake", () => {
  for (const file of PAGE_FILES) {
    const src = read(file);
    assert.doesNotMatch(src, /routerLink|\*ngFor|\*ngIf|\[\(ngModel\)/, `${file}: Angular syntax`);
    assert.doesNotMatch(src, /\u00c2|\u00e2\u20ac/, `${file}: garbled characters`);
  }
});

// ---------------------------------------------------------------- privacy guard
test("demo pages contain no real system or company names", () => {
  const banned = /charter|spectrum|cox communications|lighthouse|remedy|qmta|continuity|webex|tiki|pathtrak|chartercom/i;
  for (const file of ["js/pages/outage.js", "js/pages/repeat-outage.js"]) {
    const hit = banned.exec(read(file));
    assert.equal(hit, null, `${file} mentions "${hit && hit[0]}"`);
  }
});

test("resume page no longer shows a phone number or work email", () => {
  const src = read("js/pages/resume.js");
  assert.doesNotMatch(src, /Phone:|Work Email|303-870|@spectrum\.com|spectrum\.com/i);
});
