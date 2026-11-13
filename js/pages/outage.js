// Outage Template (demo)
//
// A portfolio recreation of an outage-ticket helper. Everything on this page is
// fake: node names, techs, supervisors, addresses, power companies and the
// "systems" (WorkBoard and TicketDesk). There are no network calls; "loading an
// order" just reads the sample data below.
//
// What it demonstrates:
//   - repeat-tier calculation from 24 hour / 10 day outage counts
//   - parsing pasted ping statistics and SNR tables into a one-line breadcrumb
//   - building ticket notes from the form (including the no-tech escalation log)
//   - conditional fields, validation, and copy-to-clipboard output
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Fake data
  // ------------------------------------------------------------------
  const SAMPLE_PING_ONE = [
    "Node DEMO-101A",
    "Ping Statistics",
    "Type Online Offline Total Unknown",
    "MTA 96.20% 15 395 0",
    "Set-top Box 94.10% 12 204 0",
    "Cable Modem 97.00% 9 301 1",
    "ONU 0.00% 0 0 0",
    "POWER SUPPLY",
    "Name Status",
    "PS-DEMO-101A-1 Online",
  ].join("\n");

  const SAMPLE_PING_TWO = [
    "Node DEMO-204B",
    "Ping Statistics",
    "Type Online Offline Total Unknown",
    "MTA 41.30% 232 395 0",
    "Set-top Box 38.00% 124 200 0",
    "Cable Modem 40.10% 180 301 2",
    "ONU 0.00% 0 0 0",
    "POWER SUPPLY",
    "Name Status",
    "PS-DEMO-204B-1 Standby",
    "",
    "Node DEMO-205A",
    "Ping Statistics",
    "Type Online Offline Total Unknown",
    "MTA 55.00% 140 311 0",
    "Set-top Box 52.40% 90 189 0",
    "Cable Modem 54.20% 120 262 0",
    "ONU 0.00% 0 0 0",
    "POWER SUPPLY",
    "Name Status",
    "PS-DEMO-205A-1 Offline",
  ].join("\n");

  const SAMPLE_PING_THREE = [
    "Node DEMO-310C",
    "Ping Statistics",
    "Type Online Offline Total Unknown",
    "MTA 12.00% 352 400 0",
    "Set-top Box 10.50% 179 200 0",
    "Cable Modem 11.30% 267 301 0",
    "ONU 0.00% 0 0 0",
    "POWER SUPPLY",
    "Name Status",
    "No results.",
  ].join("\n");

  const SAMPLE_SNR = [
    "Interface Frequency SNR",
    "ofdma-channel48:0/0/0 41.1 Mhz - 87.9 Mhz 43.20 dB",
    "us-log-channel48:0/0/0.0 22.0 Mhz - 28.4 Mhz 38.55 dB",
    "us-log-channel48:0/0/0.1 28.4 Mhz - 34.8 Mhz 39.10 dB",
  ].join("\n");

  const ORDERS = {
    "DEMO-1001": {
      label: "Single node, not a repeat",
      scope: "Single",
      h24: "1",
      h10: "2",
      power: "online",
      address: "100 Example St\n102 Example St\n104 Example St",
      tech: "Alex Rivera",
      techStatus: "spoke",
      additional: "Customers report no service. Tech en route.",
      ping: SAMPLE_PING_ONE,
      snr: SAMPLE_SNR,
      hub: "Maple Ridge Hub",
      units: [
        { id: "UNIT-0001", state: "AC power", charge: 100 },
        { id: "UNIT-0002", state: "AC power", charge: 100 },
      ],
      utilities: [{ name: "Maple Valley Electric", phone: "555-0100" }],
    },
    "DEMO-1002": {
      label: "Multi node, Tier 1 repeat",
      scope: "Multi",
      h24: "5",
      h10: "6",
      power: "showing both online and standby power supplies",
      address: "200 Sample Ave\n202 Sample Ave\n18 Placeholder Ln",
      tech: "Priya Shah",
      techStatus: "sup",
      supName: "Jordan Lee",
      additional: "Possible commercial power issue near the substation.",
      ping: SAMPLE_PING_TWO,
      snr: SAMPLE_SNR,
      hub: "Cedar Flats Hub",
      units: [
        { id: "UNIT-0101", state: "On battery", charge: 42 },
        { id: "UNIT-0102", state: "AC power", charge: 100 },
        { id: "UNIT-0103", state: "On battery", charge: 18 },
      ],
      utilities: [
        { name: "Cedar County Power", phone: "555-0142" },
        { name: "Flatland Co-op Electric", phone: "555-0177" },
      ],
    },
    "DEMO-1003": {
      label: "No tech available",
      scope: "Single",
      h24: "2",
      h10: "3",
      power: "not in the power monitor",
      address: "9 Demo Court\n11 Demo Court",
      tech: "",
      techStatus: "noTech",
      additional: "Waiting on supervisor direction.",
      ping: SAMPLE_PING_THREE,
      snr: "",
      hub: "Harbor Point Hub",
      units: [{ id: "UNIT-0201", state: "AC power", charge: 100 }],
      utilities: [{ name: "Harbor Light & Power", phone: "555-0163" }],
    },
  };

  const POWER_OPTIONS = [
    ["online", "Online"],
    ["offline", "Offline"],
    ["showing both online and offline power supplies", "Online/Offline combo"],
    ["showing both online and standby power supplies", "Online/Standby combo"],
    ["in stand-by", "Stand-by"],
    ["not in the power monitor", "Not in the power monitor"],
  ];

  const REPEAT_TYPES = [
    "Tier 1:5 unplanned outages in 1 calendar day",
    "Tier 1:6 unplanned outages in 10 calendar days",
    "Tier 2:6 unplanned outages in 1 calendar day",
    "Tier 2:7 unplanned outages in 10 calendar days",
    "Tier 3:7 unplanned outages in 1 calendar day",
    "Tier 3:8 unplanned outages in 10 calendar days",
    "Tier 4:8+ unplanned outages in 1 calendar day",
    "Tier 4:9+ unplanned outages in 10 calendar days",
  ];

  // ------------------------------------------------------------------
  // Pure logic (no DOM)
  // ------------------------------------------------------------------

  // Repeat tier from the 24 hour and 10 day unplanned outage counts.
  function pickTier(h24, h10) {
    if (h10 >= 9 || h24 >= 8) return 4;
    if (h10 === 8 || h24 === 7) return 3;
    if (h10 === 7 || h24 === 6) return 2;
    if (h10 === 6 || h24 === 5) return 1;
    return null;
  }

  // Exact Repeat Type text for a pair of counts (24 hour count wins ties).
  function repeatTypeForCounts(h24, h10) {
    const tier = pickTier(h24, h10);
    if (tier === 4) return h24 >= 8 ? REPEAT_TYPES[6] : REPEAT_TYPES[7];
    if (tier === 3) return h24 === 7 ? REPEAT_TYPES[4] : REPEAT_TYPES[5];
    if (tier === 2) return h24 === 6 ? REPEAT_TYPES[2] : REPEAT_TYPES[3];
    if (tier === 1) return h24 === 5 ? REPEAT_TYPES[0] : REPEAT_TYPES[1];
    return "";
  }

  // Parse pasted ping statistics. One block per "Node <name>" line.
  function extractNodeData(pings) {
    if (!pings || !pings.trim()) return [];

    const blocks = pings
      .split(/(?=Node\s\S+)/)
      .map((b) => b.trim())
      .filter(Boolean);

    const results = [];

    blocks.forEach((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 8) return;

      const nameMatch = lines[0].match(/Node\s(\S+)/);
      const name = nameMatch ? nameMatch[1] : "Unknown";

      // Rows are "<label> <online%> <offline> <total> <unknown>". Anchoring on the
      // percentage handles multi-word labels like "Set-top Box".
      function findRow(labelRe) {
        for (const line of lines) {
          if (!labelRe.test(line)) continue;
          const m = line.match(/(\d+(?:\.\d+)?)\s*%\s+(\d+)\s+(\d+)\s+(\d+)/);
          if (m) return { offline: parseInt(m[2], 10) || 0, total: parseInt(m[3], 10) || 0 };
        }
        return { offline: 0, total: 0 };
      }

      const rows = [
        findRow(/^MTA\b/i),
        findRow(/^Set-?top\s*Box\b/i),
        findRow(/^Cable\s*Modem\b/i),
        findRow(/^ONU\b/i),
      ];
      const offline = rows.reduce((sum, r) => sum + r.offline, 0);
      const total = rows.reduce((sum, r) => sum + r.total, 0);
      const percent =
        total > 0
          ? (offline / total).toLocaleString(undefined, {
              style: "percent",
              minimumFractionDigits: 2,
            })
          : "0%";

      // Power supply: look at the first data row after the POWER SUPPLY header.
      let powerSupply = "Online";
      const psIdx = lines.findIndex((l) => /^power\s+supply$/i.test(l));
      if (psIdx !== -1) {
        const data = lines
          .slice(psIdx + 1)
          .filter((l) => !(/^Name\s/i.test(l) && /Status/i.test(l)));
        const first = (data[0] || "").toLowerCase();
        if (!first || first.includes("no result")) powerSupply = "N/A";
        else if (first.includes("standby")) powerSupply = "Standby";
        else if (first.includes("offline")) powerSupply = "Offline";
      }

      results.push({ name, offline, total, percent, powerSupply });
    });

    return results;
  }

  // Lowest non-zero SNR across every interface row in the paste.
  function extractLowestSnr(input) {
    if (!input || !input.trim()) return "N/A";

    const values = [];
    input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((line) => {
        // Skip the column header row (has the word SNR but no "dB" reading).
        if (/\bSNR\b/i.test(line) && !/db\b/i.test(line)) return;
        const m = line.match(/(-?\d+(?:\.\d+)?)[\s\u00A0]*dB\b/i);
        if (!m) return;
        const v = parseFloat(m[1]);
        if (!isNaN(v) && v !== 0) values.push(v);
      });

    return values.length ? Math.min.apply(null, values).toFixed(2) + " dB" : "N/A";
  }

  function escStamp() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return d.toLocaleDateString() + " " + hh + ":" + mm;
  }

  // ------------------------------------------------------------------
  // Markup
  // ------------------------------------------------------------------
  function render() {
    const hours = ["", 1, 2, 3, 4, 5, 6, 7, "8+"]
      .map((v, i) => `<option value="${i === 0 ? "" : i}">${v}</option>`)
      .join("");
    const days = ["", 1, 2, 3, 4, 5, 6, 7, 8, "9+"]
      .map((v, i) => `<option value="${i === 0 ? "" : i}">${v}</option>`)
      .join("");
    const power = POWER_OPTIONS.map(
      ([value, label]) => `<option value="${value}">${label}</option>`
    ).join("");
    const repeatTypes = REPEAT_TYPES.map((t) => {
      const [tier, rest] = t.split(":");
      return `<option value="${t}">${tier}: ${rest.replace("9+", "9+ ")}</option>`;
    }).join("");
    const samples = Object.keys(ORDERS)
      .map(
        (id) =>
          `<button type="button" class="od-chip" data-sample="${id}">${id}<span>${ORDERS[id].label}</span></button>`
      )
      .join("");

    return `
<div class="od">
  <header class="od-header">
    <h1>Outage Template <span class="od-badge">Demo</span></h1>
    <p>
      A working recreation of an outage-ticket helper I built for network operations.
      Everything here is fake data and the system names are made up
      ("WorkBoard" and "TicketDesk"). Load a sample order, tweak the fields, and
      watch the repeat tier, breadcrumb and notes update.
    </p>
  </header>

  <div id="od-tier-alert" class="od-alert" role="status" aria-live="polite" hidden></div>

  <div class="od-layout">
    <div class="od-col">
      <section class="od-sec">
        <h2>Order &amp; scope</h2>
        <div class="od-field">
          <label for="od-order">WorkBoard auto-fill</label>
          <div class="od-inline">
            <input id="od-order" type="text" autocomplete="off" placeholder="Enter an order number, e.g. DEMO-1001" />
            <button type="button" class="od-btn od-btn-primary" id="od-load">Load order</button>
          </div>
          <div class="od-chips" aria-label="Sample orders">${samples}</div>
          <span class="od-hint" id="od-load-status" role="status"></span>
        </div>

        <div class="od-row od-row-3">
          <div class="od-field">
            <label for="od-scope">Scope<b class="od-req">*</b></label>
            <select id="od-scope"><option value=""></option><option value="Single">Single node</option><option value="Multi">Multi node</option></select>
          </div>
          <div class="od-field">
            <label for="od-h24">Outages, 24 hr<b class="od-req">*</b></label>
            <select id="od-h24">${hours}</select>
            <span class="od-hint">Including this one</span>
          </div>
          <div class="od-field">
            <label for="od-h10">Outages, 10 days<b class="od-req">*</b></label>
            <select id="od-h10">${days}</select>
            <span class="od-hint">Including this one</span>
          </div>
        </div>

        <div class="od-row od-row-2">
          <div class="od-field">
            <label for="od-repeat">Repeat<b class="od-req">*</b></label>
            <select id="od-repeat"><option value=""></option><option value="Yes">Yes</option><option value="No">No</option></select>
          </div>
          <div class="od-field" id="od-repeat-type-row" hidden>
            <label for="od-repeat-type">Repeat type</label>
            <select id="od-repeat-type"><option value=""></option>${repeatTypes}</select>
          </div>
        </div>
      </section>

      <section class="od-sec">
        <h2>Related tickets</h2>
        <p class="od-hint">Add other order numbers affected by the same event.</p>
        <div class="od-inline">
          <input id="od-related-input" type="text" autocomplete="off" placeholder="DEMO-1002" />
          <button type="button" class="od-btn" id="od-related-add">Add</button>
        </div>
        <ul class="od-related" id="od-related-list"></ul>
      </section>
    </div>

    <div class="od-col">
      <section class="od-sec">
        <h2>Power &amp; impact</h2>
        <div class="od-field">
          <label for="od-power">Power status<b class="od-req">*</b></label>
          <select id="od-power"><option value=""></option>${power}</select>
        </div>
        <div class="od-field">
          <label for="od-address">Affected addresses</label>
          <textarea id="od-address" rows="3"></textarea>
        </div>
      </section>

      <section class="od-sec">
        <h2>Dispatch</h2>
        <div class="od-field">
          <label for="od-tech">Maintenance tech<b class="od-req">*</b></label>
          <input id="od-tech" type="text" autocomplete="off" />
        </div>
        <div class="od-field">
          <span class="od-label" id="od-ts-label">Tech status<b class="od-req">*</b></span>
          <div class="od-seg" role="radiogroup" aria-labelledby="od-ts-label">
            <label><input type="radio" name="od-techStatus" value="spoke" /><span>Spoke to</span></label>
            <label><input type="radio" name="od-techStatus" value="sup" /><span>Per supervisor</span></label>
            <label><input type="radio" name="od-techStatus" value="email" /><span>Email</span></label>
            <label><input type="radio" name="od-techStatus" value="noDispatch" /><span>No dispatch</span></label>
            <label><input type="radio" name="od-techStatus" value="noTech" /><span>No tech available</span></label>
          </div>
          <span class="od-hint od-warn">Positive contact must be made</span>
        </div>

        <div class="od-field" id="od-sup-row" hidden>
          <label for="od-sup">Supervisor spoke to</label>
          <input id="od-sup" type="text" list="od-sup-list" autocomplete="off" placeholder="Type to search or enter manually" />
        </div>

        <div class="od-field">
          <label for="od-additional">Additional details</label>
          <textarea id="od-additional" rows="3"></textarea>
        </div>

        <div class="od-field od-esc" id="od-esc-row" hidden>
          <span class="od-label">Escalation: no tech available</span>
          <p class="od-hint">Enter the supervisor, then pick the one outcome that applies. Choosing another outcome replaces the note.</p>
          <input id="od-esc-sup" type="text" list="od-sup-list" autocomplete="off" placeholder="Supervisor name" aria-label="Escalation supervisor name" />
          <div class="od-esc-actions">
            <button type="button" class="od-btn od-btn-sm" data-esc="notified">Sup notified (push 2 hr)</button>
            <button type="button" class="od-btn od-btn-sm" data-esc="stack">Sup approved stacking</button>
            <button type="button" class="od-btn od-btn-sm" data-esc="noAnswer">Sup no answer (VM, push 2 hr)</button>
          </div>
          <textarea id="od-esc-log" rows="2" readonly aria-label="Escalation log"></textarea>
        </div>
        <datalist id="od-sup-list">
          <option value="Jordan Lee"></option>
          <option value="Morgan Ellis"></option>
          <option value="Sam Whitfield"></option>
        </datalist>
      </section>
    </div>

    <div class="od-col">
      <section class="od-sec">
        <h2>Node data</h2>
        <div class="od-field">
          <div class="od-label-row">
            <label for="od-ping">Ping stats</label>
            <button type="button" class="od-link" id="od-ping-example">Insert example</button>
          </div>
          <span class="od-hint">Node line through the end of Power Supplies</span>
          <textarea id="od-ping" class="od-paste" rows="8" placeholder="Paste ping stats here"></textarea>
        </div>
        <div class="od-field">
          <div class="od-label-row">
            <label for="od-snr">SNR</label>
            <button type="button" class="od-link" id="od-snr-example">Insert example</button>
          </div>
          <span class="od-hint">Interface line through the end of the SNR values</span>
          <textarea id="od-snr" class="od-paste" rows="5" placeholder="Paste SNR data here"></textarea>
        </div>
      </section>

      <section class="od-sec">
        <h2>Battery status</h2>
        <div id="od-battery"><p class="od-hint">Loads when an order is entered.</p></div>
      </section>

      <section class="od-sec">
        <h2>Power companies</h2>
        <div id="od-utilities"><p class="od-hint">Filled in from the order's hub.</p></div>
      </section>
    </div>
  </div>

  <section class="od-sec od-output" id="od-output" hidden>
    <h2>Generated output</h2>
    <div class="od-field">
      <label for="od-breadcrumb">WorkBoard triage breadcrumb</label>
      <textarea id="od-breadcrumb" rows="3" readonly placeholder="Node: XY001A | xx/xxx | x.xx% offline | Power Supply: Online | SNR: xx.xx dB |"></textarea>
    </div>
    <div class="od-field">
      <label for="od-notes">Notes (TicketDesk)</label>
      <textarea id="od-notes" rows="6" readonly></textarea>
    </div>
    <div class="od-actions">
      <button type="button" class="od-btn od-btn-primary" id="od-copy-wb">Copy to WorkBoard</button>
      <button type="button" class="od-btn" id="od-copy-td">Copy to TicketDesk</button>
      <button type="button" class="od-btn od-btn-danger" id="od-clear">Clear</button>
      <span class="od-status" id="od-status" role="status" aria-live="polite"></span>
    </div>
  </section>
</div>`;
  }

  // ------------------------------------------------------------------
  // Behavior
  // ------------------------------------------------------------------
  function mount(root) {
    const $ = (id) => root.querySelector("#" + id);
    const timers = [];
    let escalationNotes = "";
    let escChoice = "";
    let hub = "";
    let units = [];
    let related = [];
    let statusTimer = null;

    const val = (id) => $(id).value;
    const setVal = (id, v) => ($(id).value = v == null ? "" : v);
    const techStatus = () => {
      const el = root.querySelector('input[name="od-techStatus"]:checked');
      return el ? el.value : "";
    };

    function say(msg, isError) {
      const el = $("od-status");
      el.textContent = msg;
      el.classList.toggle("od-status-error", !!isError);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => (el.textContent = ""), 3500);
    }

    // ---- Breadcrumb from pasted ping + SNR ----
    function buildBreadcrumb() {
      const nodes = extractNodeData(val("od-ping"));
      const snr = extractLowestSnr(val("od-snr"));
      // The SNR paste belongs to one node (the first); any others show N/A.
      const lines = nodes.map(
        (n, i) =>
          `Node: ${n.name} | ${n.offline}/${n.total} | ${n.percent} offline | ` +
          `Power Supply: ${n.powerSupply} | SNR: ${i === 0 ? snr : "N/A"} |`
      );
      setVal("od-breadcrumb", lines.join("\n"));
    }

    // ---- Ticket notes from the form ----
    function buildNotes() {
      const scope = val("od-scope");
      const power = val("od-power");
      const repeat = val("od-repeat");
      const tech = val("od-tech").trim();
      const sup = val("od-sup").trim();

      let repeatScript = "";
      if (repeat === "Yes") repeatScript = `This is the ${val("od-repeat-type")}. `;
      else if (repeat === "No") repeatScript = "This is not a repeat. ";

      const perWho = sup ? `per supervisor ${sup}` : "per supervisor (or above)";
      const verbs = {
        spoke: `The analyst spoke to ${tech} and they are being dispatched at this time.`,
        email: `The analyst has assigned this job to tech ${tech} per an email request.`,
        sup: `The analyst has assigned ${tech} ${perWho}.`,
        noDispatch: "No tech has been dispatched at this time.",
        noTech: "No tech is available at this time.",
      };
      const verb = verbs[techStatus()] || "";

      let notes =
        `Initial Notes: This is a ${scope || "___"} node outage. ` +
        `${repeatScript}Power status is ${power || "___"}. ${verb}` +
        `\n${val("od-additional")}`;

      if (escalationNotes.trim()) notes += "\n\n" + escalationNotes.trim();
      setVal("od-notes", notes);
    }

    // ---- Repeat tier banner + auto-selected repeat type ----
    function refreshRepeat(autoSet) {
      const h24 = parseInt(val("od-h24"), 10);
      const h10 = parseInt(val("od-h10"), 10);
      const alert = $("od-tier-alert");
      const ready = !isNaN(h24) && !isNaN(h10);
      const tier = ready ? pickTier(h24, h10) : null;

      if (autoSet && ready) {
        setVal("od-repeat", tier ? "Yes" : "No");
        setVal("od-repeat-type", tier ? repeatTypeForCounts(h24, h10) : "");
      }

      if (tier) {
        alert.hidden = false;
        alert.textContent =
          `Tier ${tier} repeat. Dispatch first, notate the order, then send the follow-up repeat email. `;
        const link = document.createElement("a");
        link.href = "#/repeat-outage-template";
        link.className = "od-alert-link";
        link.textContent = "Open the repeat email form";
        link.addEventListener("click", () => {
          const firstNode = extractNodeData(val("od-ping"))[0];
          // Carry the order across to the Repeat Outage demo (in memory only).
          window.DemoHandoff = window.DemoHandoff || {};
          window.DemoHandoff.repeat = {
            order: val("od-order").trim().toUpperCase(),
            node: firstNode ? firstNode.name : "",
            power: val("od-power") === "not in the power monitor" ? "is not in the power monitor" : val("od-power"),
            tech: val("od-tech").trim(),
            ssa: val("od-h24"),
            unplanned: val("od-h10"),
          };
        });
        alert.appendChild(link);
      } else {
        alert.hidden = true;
        alert.textContent = "";
      }
    }

    function toggleConditional() {
      $("od-repeat-type-row").hidden = val("od-repeat") !== "Yes";
      $("od-sup-row").hidden = techStatus() !== "sup";
      $("od-esc-row").hidden = techStatus() !== "noTech";
    }

    function hasAnyInput() {
      return [
        "od-scope", "od-h24", "od-h10", "od-repeat", "od-power", "od-address",
        "od-tech", "od-additional", "od-ping", "od-snr",
      ].some((id) => val(id).trim()) || !!techStatus() || !!escalationNotes;
    }

    function update(opts) {
      refreshRepeat(opts && opts.autoRepeat);
      toggleConditional();
      buildBreadcrumb();
      buildNotes();
      $("od-output").hidden = !hasAnyInput();
    }

    // ---- Escalation (no tech available) ----
    function setEscalation(which) {
      const sup = val("od-esc-sup").trim();
      if (!sup) {
        escalationNotes = "";
        escChoice = "";
        setVal("od-esc-log", "");
        $("od-esc-sup").classList.add("od-missing");
        say("Enter the supervisor name first.", true);
        update();
        return;
      }
      $("od-esc-sup").classList.remove("od-missing");

      let line;
      if (which === "notified") {
        line = `${escStamp()} \u2014 No maintenance tech available. Called ${sup} \u2014 notified of outage, no tech available to assign. Pushed timer 2 hours.`;
      } else if (which === "stack") {
        line = `${escStamp()} \u2014 No maintenance tech available. ${sup} approved stacking. Stacking outage per their instruction.`;
        const tech = val("od-tech").trim();
        if (tech) line += ` ${tech} was dispatched.`;
      } else {
        line = `${escStamp()} \u2014 No maintenance tech available. Called ${sup} \u2014 no answer. Left voicemail. Pushed timer 2 hours.`;
      }
      escalationNotes = line;
      escChoice = which;
      setVal("od-esc-log", line);
      root.querySelectorAll("[data-esc]").forEach((b) =>
        b.classList.toggle("od-btn-active", b.dataset.esc === which)
      );
      update();
    }

    // ---- Sample order "lookup" ----
    function renderBattery() {
      const box = $("od-battery");
      if (!units.length) {
        box.innerHTML = '<p class="od-hint">Loads when an order is entered.</p>';
        return;
      }
      const rows = units
        .map(
          (u) =>
            `<tr class="${u.state === "On battery" ? "od-row-warn" : ""}"><td>${u.id}</td><td>${u.state}</td><td>${u.charge}%</td></tr>`
        )
        .join("");
      box.innerHTML =
        `<p class="od-hint">${hub}</p><table class="od-table"><thead><tr><th>Unit</th><th>State</th><th>Charge</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    function renderUtilities(list) {
      const box = $("od-utilities");
      if (!list || !list.length) {
        box.innerHTML = '<p class="od-hint">Filled in from the order\'s hub.</p>';
        return;
      }
      box.innerHTML =
        "<ul class=\"od-plain\">" +
        list.map((u) => `<li>${u.name} <span class="od-hint">${u.phone}</span></li>`).join("") +
        "</ul>";
    }

    function applyOrder(id) {
      const o = ORDERS[id];
      setVal("od-order", id);
      setVal("od-scope", o.scope);
      setVal("od-h24", o.h24);
      setVal("od-h10", o.h10);
      setVal("od-power", o.power);
      setVal("od-address", o.address);
      setVal("od-tech", o.tech);
      setVal("od-sup", o.supName || "");
      setVal("od-additional", o.additional);
      setVal("od-ping", o.ping);
      setVal("od-snr", o.snr);
      root.querySelectorAll('input[name="od-techStatus"]').forEach((r) => {
        r.checked = r.value === o.techStatus;
      });
      escalationNotes = "";
      escChoice = "";
      setVal("od-esc-log", "");
      setVal("od-esc-sup", "");
      root.querySelectorAll("[data-esc]").forEach((b) => b.classList.remove("od-btn-active"));
      hub = o.hub;
      units = o.units;
      renderBattery();
      renderUtilities(o.utilities);
      update({ autoRepeat: true });
    }

    function loadOrder(rawId) {
      const id = (rawId || val("od-order")).trim().toUpperCase();
      const status = $("od-load-status");
      if (!ORDERS[id]) {
        status.textContent = id
          ? `No demo data for "${id}". Try ${Object.keys(ORDERS).join(", ")}.`
          : "Enter an order number first.";
        return;
      }
      status.textContent = "Looking up order\u2026";
      timers.push(
        setTimeout(() => {
          applyOrder(id);
          status.textContent = `Loaded ${id}: ${ORDERS[id].label}.`;
        }, 350)
      );
    }

    // ---- Related tickets ----
    function renderRelated() {
      const list = $("od-related-list");
      list.innerHTML = "";
      related.forEach((id) => {
        const li = document.createElement("li");
        li.textContent = id + " ";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "od-link";
        btn.textContent = "Remove";
        btn.setAttribute("aria-label", "Remove " + id);
        btn.addEventListener("click", () => {
          related = related.filter((r) => r !== id);
          renderRelated();
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
    }

    function addRelated() {
      const id = val("od-related-input").trim().toUpperCase();
      if (!id) return;
      if (!related.includes(id)) related.push(id);
      setVal("od-related-input", "");
      renderRelated();
    }

    // ---- Validation + copy ----
    function validate(includeDispatch) {
      const required = [
        ["od-scope", val("od-scope")],
        ["od-h24", val("od-h24")],
        ["od-h10", val("od-h10")],
        ["od-repeat", val("od-repeat")],
        ["od-power", val("od-power")],
      ];
      if (includeDispatch) {
        required.push(["od-tech", techStatus() === "noTech" || val("od-tech").trim()]);
        required.push(["od-ts-label", techStatus()]);
      }
      root.querySelectorAll(".od-missing").forEach((el) => el.classList.remove("od-missing"));
      const missing = required.filter(([, v]) => !v);
      missing.forEach(([id]) => $(id).classList.add("od-missing"));
      if (missing.length) {
        say("Fill in the highlighted fields first.", true);
        const first = $(missing[0][0]);
        if (first && first.focus && first.tagName !== "SPAN") first.focus();
        return false;
      }
      return true;
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // Fallback for browsers/contexts without the async clipboard API.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
        ta.remove();
        return ok;
      }
    }

    function batteryNotes() {
      const on = units.filter((u) => u.state === "On battery");
      if (!on.length) return "";
      return "Units on battery: " + on.map((u) => `${u.id} (${u.charge}%)`).join(", ");
    }

    function relatedSummary() {
      return related.length ? "Related tickets: " + related.join(", ") : "";
    }

    async function copyToWorkBoard() {
      if (!validate(false)) return;
      const text = [relatedSummary(), val("od-breadcrumb"), val("od-notes"), batteryNotes()]
        .filter((s) => s && s.trim())
        .join("\n\n");
      if (!text.trim()) return say("Nothing to copy yet.", true);
      say((await copyText(text)) ? "Copied for WorkBoard." : "Copy failed.", false);
    }

    async function copyToTicketDesk() {
      if (!validate(true)) return;
      const text = [relatedSummary(), val("od-breadcrumb"), val("od-notes"), batteryNotes()]
        .filter((s) => s && s.trim())
        .join("\n\n");
      const ok = await copyText(text);
      const tier = val("od-repeat") === "Yes" && /^Tier/.test(val("od-repeat-type"));
      say(
        ok
          ? tier
            ? "Copied for TicketDesk. Remember the repeat email."
            : "Copied for TicketDesk."
          : "Copy failed.",
        !ok
      );
    }

    function clearAll() {
      ["od-order", "od-scope", "od-h24", "od-h10", "od-repeat", "od-repeat-type", "od-power",
        "od-address", "od-tech", "od-sup", "od-additional", "od-ping", "od-snr", "od-esc-sup",
        "od-esc-log", "od-related-input"].forEach((id) => setVal(id, ""));
      root.querySelectorAll('input[name="od-techStatus"]').forEach((r) => (r.checked = false));
      root.querySelectorAll(".od-missing").forEach((el) => el.classList.remove("od-missing"));
      root.querySelectorAll("[data-esc]").forEach((b) => b.classList.remove("od-btn-active"));
      escalationNotes = "";
      escChoice = "";
      hub = "";
      units = [];
      related = [];
      renderRelated();
      renderBattery();
      renderUtilities(null);
      $("od-load-status").textContent = "";
      update();
      say("Cleared.", false);
    }

    // ---- Wiring ----
    root.addEventListener("input", (e) => {
      if (e.target.classList) e.target.classList.remove("od-missing");
      if (e.target.id === "od-order" || e.target.id === "od-related-input" || e.target.id === "od-esc-sup") return;
      update();
    });
    root.addEventListener("change", (e) => {
      const id = e.target.id;
      if (id === "od-h24" || id === "od-h10") return update({ autoRepeat: true });
      if (id === "od-order" || id === "od-related-input") return;
      update();
    });

    $("od-load").addEventListener("click", () => loadOrder());
    $("od-order").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); loadOrder(); }
    });
    root.querySelectorAll("[data-sample]").forEach((b) =>
      b.addEventListener("click", () => loadOrder(b.dataset.sample))
    );
    root.querySelectorAll("[data-esc]").forEach((b) =>
      b.addEventListener("click", () => setEscalation(b.dataset.esc))
    );
    $("od-related-add").addEventListener("click", addRelated);
    $("od-related-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); addRelated(); }
    });
    $("od-ping-example").addEventListener("click", () => { setVal("od-ping", SAMPLE_PING_TWO); update(); });
    $("od-snr-example").addEventListener("click", () => { setVal("od-snr", SAMPLE_SNR); update(); });
    $("od-copy-wb").addEventListener("click", copyToWorkBoard);
    $("od-copy-td").addEventListener("click", copyToTicketDesk);
    $("od-clear").addEventListener("click", clearAll);

    update();

    // Cleanup when the router leaves this page.
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(statusTimer);
    };
  }

  (window.Pages = window.Pages || {})["outage"] = { render, mount };
})();
