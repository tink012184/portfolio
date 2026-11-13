// Repeat Outage Email Creator (demo)
//
// A portfolio recreation of a tool that builds the escalation email for repeat
// outages. Everything here is fake: regions, markets, hubs, nodes, techs, email
// addresses (all @example.com) and the "WorkBoard" and "TicketDesk" systems.
// Nothing is sent anywhere; "Create email" builds a preview you can copy.
//
// What it demonstrates:
//   - cascading Region > Market > Hub > Node selects
//   - tier calculation (1-4) from 24 hour and 10 day unplanned outage counts
//   - a "no email required" path when counts are below the threshold
//   - building recipients, subject and body from the form
//   - screenshot attachments (choose, drag in, or paste)
//   - a hand-off from the Outage Template demo
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // Fake data
  // ------------------------------------------------------------------
  const GEOGRAPHY = {
    "North Region": {
      "Lakeside Market": {
        "Maple Ridge Hub": ["DEMO-101A", "DEMO-102B"],
        "Cedar Flats Hub": ["DEMO-204B", "DEMO-205A"],
      },
    },
    "South Region": {
      "Harbor Market": {
        "Harbor Point Hub": ["DEMO-310C", "DEMO-311A"],
      },
      "Riverbend Market": {
        "Riverbend Hub": ["DEMO-401A"],
      },
    },
  };

  const ORDERS = {
    "DEMO-2001": {
      label: "Below threshold, no email",
      region: "North Region", market: "Lakeside Market", hub: "Maple Ridge Hub", node: "DEMO-101A",
      power: "online", inc: "INC-DEMO-0001",
      tech: "Alex Rivera", techEmail: "alex.rivera@example.com",
      ssa: "2", unplanned: "4", y6: "0",
      summary: "Brief outage cleared after a tap was reseated. No pattern yet.",
    },
    "DEMO-2002": {
      label: "Tier 2 repeat",
      region: "North Region", market: "Lakeside Market", hub: "Cedar Flats Hub", node: "DEMO-204B",
      power: "showing both online and standby power supplies", inc: "INC-DEMO-0002",
      tech: "Priya Shah", techEmail: "priya.shah@example.com",
      ssa: "6", unplanned: "6", y6: "2",
      summary: "Repeated upstream noise on the same leg. Power supply flips to standby during each event. Starting point: the amplifier at the end of the first span.",
    },
    "DEMO-2003": {
      label: "Tier 4 repeat",
      region: "South Region", market: "Harbor Market", hub: "Harbor Point Hub", node: "DEMO-310C",
      power: "offline", inc: "INC-DEMO-0003",
      tech: "Sam Whitfield", techEmail: "sam.whitfield@example.com",
      ssa: "8", unplanned: "9", y6: "5",
      summary: "Node has gone down eight times in a day. Power supply is offline during each event and commercial power is unstable.",
    },
  };

  const POWER_OPTIONS = [
    ["online", "Online"],
    ["offline", "Offline"],
    ["showing both online and offline power supplies", "Online/Offline combo"],
    ["showing both online and standby power supplies", "Online/Standby combo"],
    ["in stand-by", "Stand-by"],
    ["is not in the power monitor", "Not in the power monitor"],
  ];

  const CHECKLIST = [
    ["Power supply", ["Power monitor screenshot", "Present alarms", "Online/offline status"]],
    ["Node health", ["Top impairments", "What impairments exist?"]],
    ["Alarm history", ["Helps determine impairments", "Not used for outage count", "What is the node alarming for?"]],
    ["Order history", ["Number of outages in 1 day / 10 days", "Completed fixes"]],
    ["Upstream and downstream", ["Impairments on either path", "Intermittent outage indicators"]],
    ["Signal quality", ["FEC / SNR / throughput (1 week)", "Modem count"]],
    ["Noise", ["Current noise", "Historical noise"]],
    ["Starting point", ["Where should the tech begin troubleshooting?"]],
  ];

  const TIER_NOTE = {
    1: "Caution: close to the threshold.",
    2: "Warning: escalating pattern.",
    3: "Notify the supervisor chat.",
    4: "Critical: notify the supervisor chat.",
  };

  // ------------------------------------------------------------------
  // Pure logic
  // ------------------------------------------------------------------

  // Tier 1-4 from the 24 hour (ssa) and 10 day (unplanned) counts, or null when
  // the counts are below the email threshold.
  function pickTier(ssa, unplanned) {
    const s = Number(ssa) || 0;
    const u = Number(unplanned) || 0;
    if (s < 5 && u < 6) return null;

    let t = 0;
    if (s === 5 || u === 6) t = 1;
    if (s === 6 || u === 7) t = 2;
    if (s === 7 || u === 8) t = 3;
    if (s === 8 || u === 9) t = 4;
    return t || null;
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function tenDaysAgoLabel() {
    const d = new Date();
    d.setDate(d.getDate() - 10);
    return d.toLocaleDateString();
  }

  // Build recipients, subject and body for a repeat email.
  function buildEmail(f, tier) {
    const to = [
      `ops-center-${slug(f.region)}@example.com`,
      `escalation-${slug(f.market)}-t${tier}@example.com`,
      f.techEmail,
    ].filter((s) => s && s.trim());

    const subject = `Tier ${tier} - Repeat Outage! ${f.region} -> ${f.market} - ${f.hub} -> ${f.node}`;
    const body = [
      `Node(s): ${f.node}`,
      `Tech ${f.tech || "(not entered)"} (Email: ${f.techEmail || "n/a"}) has been dispatched to investigate.`,
      `Number of Unplanned Outages in 24 Hours: ${f.ssa}`,
      `Number of Unplanned Outages in 10 Days: ${f.unplanned}`,
      `Number of Y6's in last 10 Days: ${f.y6 || "0"}`,
      `Summary of findings: ${(f.summary || "").replace(/[\r\n]+/g, " ")}`,
      f.order ? `WorkBoard order: ${f.order}` : "",
      f.inc ? `TicketDesk: ${f.inc}` : "",
      `Power supply status: ${f.power}.`,
    ]
      .filter(Boolean)
      .join("\n");

    return { to: to.join("; "), cc: "ops-managers@example.com", subject, body };
  }

  // ------------------------------------------------------------------
  // Markup
  // ------------------------------------------------------------------
  function render() {
    const ssa = ["", 1, 2, 3, 4, 5, 6, 7, "8+"]
      .map((v, i) => `<option value="${i === 0 ? "" : i}">${v === "" ? "Select" : v}</option>`)
      .join("");
    const unplanned = ["", 1, 2, 3, 4, 5, 6, 7, 8, "9+"]
      .map((v, i) => `<option value="${i === 0 ? "" : i}">${v === "" ? "Select" : v}</option>`)
      .join("");
    const power = POWER_OPTIONS.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    const regions = Object.keys(GEOGRAPHY)
      .map((r) => `<option value="${r}">${r}</option>`)
      .join("");
    const samples = Object.keys(ORDERS)
      .map(
        (id) =>
          `<button type="button" class="od-chip" data-sample="${id}">${id}<span>${ORDERS[id].label}</span></button>`
      )
      .join("");
    const checklist = CHECKLIST.map(
      ([title, items]) =>
        `<details class="od-details"><summary>${title}</summary><ul>${items
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul></details>`
    ).join("");

    return `
<div class="od">
  <header class="od-header">
    <h1>Repeat Outage Email Creator <span class="od-badge">Demo</span></h1>
    <p>
      A working recreation of a tool that builds the escalation email for repeat
      outages. Everything here is fake data, and no email is sent. Load a sample
      order or fill in the form, and the tier is worked out from the outage counts.
    </p>
  </header>

  <div class="od-layout od-layout-2">
    <div class="od-col">
      <section class="od-sec">
        <h2>Email details</h2>
        <p class="od-hint">For repeats, 10 days ago is <strong>${tenDaysAgoLabel()}</strong>.</p>

        <div class="od-field">
          <label for="ro-order">WorkBoard order # (auto-fill)</label>
          <div class="od-inline">
            <input id="ro-order" type="text" autocomplete="off" placeholder="e.g. DEMO-2002" />
            <button type="button" class="od-btn od-btn-primary" id="ro-load">Load order</button>
          </div>
          <div class="od-chips" aria-label="Sample orders">${samples}</div>
          <span class="od-hint" id="ro-load-status" role="status"></span>
        </div>

        <div id="ro-tier-alert" class="od-alert" role="status" aria-live="polite" hidden></div>

        <div class="od-row od-row-2">
          <div class="od-field">
            <label for="ro-region">Region<b class="od-req">*</b></label>
            <select id="ro-region"><option value="">Select</option>${regions}</select>
          </div>
          <div class="od-field">
            <label for="ro-market">Market<b class="od-req">*</b></label>
            <select id="ro-market" disabled><option value="">Select</option></select>
          </div>
          <div class="od-field">
            <label for="ro-hub">Hub<b class="od-req">*</b></label>
            <select id="ro-hub" disabled><option value="">Select</option></select>
          </div>
          <div class="od-field">
            <label for="ro-node">Node<b class="od-req">*</b></label>
            <select id="ro-node" disabled><option value="">Select</option></select>
          </div>
        </div>

        <div class="od-row od-row-2">
          <div class="od-field">
            <label for="ro-power">Power supply status<b class="od-req">*</b></label>
            <select id="ro-power"><option value=""></option>${power}</select>
          </div>
          <div class="od-field">
            <label for="ro-inc">TicketDesk INC #</label>
            <input id="ro-inc" type="text" autocomplete="off" />
          </div>
          <div class="od-field">
            <label for="ro-tech">Maintenance tech dispatched</label>
            <input id="ro-tech" type="text" autocomplete="off" />
          </div>
          <div class="od-field">
            <label for="ro-tech-email">Tech email</label>
            <input id="ro-tech-email" type="text" autocomplete="off" />
          </div>
          <div class="od-field">
            <label for="ro-ssa">Unplanned outages in 24 hours<b class="od-req">*</b></label>
            <select id="ro-ssa">${ssa}</select>
          </div>
          <div class="od-field">
            <label for="ro-unplanned">Unplanned outages in last 10 days<b class="od-req">*</b></label>
            <select id="ro-unplanned">${unplanned}</select>
          </div>
          <div class="od-field">
            <label for="ro-y6">Number of Y6's in last 10 days</label>
            <input id="ro-y6" type="text" inputmode="numeric" autocomplete="off" />
          </div>
        </div>

        <div class="od-field">
          <label for="ro-summary">Summary of findings</label>
          <span class="od-hint">Describe the issues and patterns observed. Focus on what is contributing to the repeat outages.</span>
          <textarea id="ro-summary" rows="4"></textarea>
        </div>

        <div class="od-actions">
          <button type="button" class="od-btn od-btn-primary" id="ro-create">Create email</button>
          <button type="button" class="od-btn" id="ro-chat" hidden>Copy chat summary</button>
          <button type="button" class="od-btn od-btn-danger" id="ro-clear">Clear</button>
          <span class="od-status" id="ro-status" role="status" aria-live="polite"></span>
        </div>
      </section>

      <section class="od-sec od-output" id="ro-preview" hidden>
        <h2>Email preview</h2>
        <dl class="od-email">
          <dt>To</dt><dd id="ro-p-to"></dd>
          <dt>Cc</dt><dd id="ro-p-cc"></dd>
          <dt>Subject</dt><dd id="ro-p-subject"></dd>
        </dl>
        <textarea id="ro-p-body" rows="9" readonly aria-label="Email body"></textarea>
        <p class="od-hint" id="ro-p-attach"></p>
        <div class="od-actions">
          <button type="button" class="od-btn od-btn-primary" id="ro-copy">Copy email text</button>
        </div>
      </section>
    </div>

    <div class="od-col">
      <section class="od-sec">
        <h2>Screenshots</h2>
        <div class="od-drop" id="ro-drop" tabindex="0" role="button" aria-label="Attach screenshots. Click to browse, or drag and drop, or paste.">
          <p>Drag and drop images here, paste (Ctrl+V), or click to browse</p>
          <p class="od-hint">PNG, JPG or GIF, up to 5 MB each and 10 images</p>
          <input type="file" id="ro-file" accept="image/png,image/jpeg,image/gif" multiple hidden />
        </div>
        <ul class="od-thumbs" id="ro-thumbs"></ul>
        <p class="od-note">Don't forget to screenshot the power supplies.</p>
        ${checklist}
      </section>
    </div>
  </div>
</div>`;
  }

  // ------------------------------------------------------------------
  // Behavior
  // ------------------------------------------------------------------
  function mount(root) {
    const $ = (id) => root.querySelector("#" + id);
    const val = (id) => $(id).value;
    const setVal = (id, v) => ($(id).value = v == null ? "" : v);
    const timers = [];
    let statusTimer = null;
    let images = []; // { id, name, url }
    let nextImageId = 1;
    let order = ""; // last loaded order number

    function say(msg, isError) {
      const el = $("ro-status");
      el.textContent = msg;
      el.classList.toggle("od-status-error", !!isError);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => (el.textContent = ""), 4000);
    }

    // ---- Cascading selects ----
    function fillSelect(id, values, selected) {
      const el = $(id);
      el.innerHTML =
        '<option value="">Select</option>' +
        values.map((v) => `<option value="${v}">${v}</option>`).join("");
      el.disabled = values.length === 0;
      el.value = selected && values.includes(selected) ? selected : "";
    }

    function setLocation(region, market, hub, node) {
      setVal("ro-region", region);
      const markets = region && GEOGRAPHY[region] ? Object.keys(GEOGRAPHY[region]) : [];
      fillSelect("ro-market", markets, market);
      const hubs = markets.includes(market) ? Object.keys(GEOGRAPHY[region][market]) : [];
      fillSelect("ro-hub", hubs, hub);
      const nodes = hubs.includes(hub) ? GEOGRAPHY[region][market][hub] : [];
      fillSelect("ro-node", nodes, node);
    }

    function onLocationChange(level) {
      const region = val("ro-region");
      const market = level === "region" ? "" : val("ro-market");
      const hub = level === "region" || level === "market" ? "" : val("ro-hub");
      setLocation(region, market, hub, "");
    }

    // ---- Tier banner ----
    function refreshTier() {
      const alert = $("ro-tier-alert");
      const tier = pickTier(val("ro-ssa"), val("ro-unplanned"));
      alert.className = "od-alert" + (tier ? " od-tier-" + tier : "");
      if (tier) {
        alert.hidden = false;
        alert.textContent = `Tier ${tier} repeat outage. ${TIER_NOTE[tier]}`;
      } else {
        alert.hidden = true;
        alert.textContent = "";
      }
      $("ro-chat").hidden = !(tier && tier >= 2);
    }

    function collect() {
      return {
        region: val("ro-region"),
        market: val("ro-market"),
        hub: val("ro-hub"),
        node: val("ro-node"),
        power: val("ro-power"),
        inc: val("ro-inc").trim(),
        tech: val("ro-tech").trim(),
        techEmail: val("ro-tech-email").trim(),
        ssa: val("ro-ssa"),
        unplanned: val("ro-unplanned"),
        y6: val("ro-y6").trim(),
        summary: val("ro-summary"),
        order,
      };
    }

    function applySample(data, orderId) {
      order = orderId || "";
      setLocation(data.region, data.market, data.hub, data.node);
      setVal("ro-power", data.power);
      setVal("ro-inc", data.inc);
      setVal("ro-tech", data.tech);
      setVal("ro-tech-email", data.techEmail);
      setVal("ro-ssa", data.ssa);
      setVal("ro-unplanned", data.unplanned);
      setVal("ro-y6", data.y6);
      setVal("ro-summary", data.summary);
      if (orderId) setVal("ro-order", orderId);
      refreshTier();
      $("ro-preview").hidden = true;
    }

    function loadOrder(rawId) {
      const id = (rawId || val("ro-order")).trim().toUpperCase();
      const status = $("ro-load-status");
      if (!ORDERS[id]) {
        status.textContent = id
          ? `No demo data for "${id}". Try ${Object.keys(ORDERS).join(", ")}.`
          : "Enter an order number first.";
        return;
      }
      status.textContent = "Looking up order\u2026";
      timers.push(
        setTimeout(() => {
          applySample(ORDERS[id], id);
          status.textContent = `Loaded ${id}: ${ORDERS[id].label}.`;
        }, 350)
      );
    }

    // ---- Create email ----
    function markMissing(ids) {
      root.querySelectorAll(".od-missing").forEach((el) => el.classList.remove("od-missing"));
      ids.forEach((id) => $(id).classList.add("od-missing"));
      if (ids.length) $(ids[0]).focus();
    }

    function createEmail() {
      const f = collect();
      const missing = [];
      if (!f.region) missing.push("ro-region");
      else if (!f.market) missing.push("ro-market");
      else if (!f.hub) missing.push("ro-hub");
      else if (!f.node) missing.push("ro-node");
      if (!f.power) missing.push("ro-power");
      if (!f.ssa) missing.push("ro-ssa");
      if (!f.unplanned) missing.push("ro-unplanned");
      markMissing(missing);
      if (missing.length) return say("Fill in the highlighted fields first.", true);

      const tier = pickTier(f.ssa, f.unplanned);
      if (!tier) {
        $("ro-preview").hidden = true;
        return say("No email required. Outage counts are below the Tier threshold.", true);
      }

      const email = buildEmail(f, tier);
      $("ro-p-to").textContent = email.to;
      $("ro-p-cc").textContent = email.cc;
      $("ro-p-subject").textContent = email.subject;
      $("ro-p-body").value = email.body;
      $("ro-p-attach").textContent = images.length
        ? `${images.length} screenshot${images.length === 1 ? "" : "s"} attached. In the real tool these are pasted into the email along with the text.`
        : "No screenshots attached.";
      $("ro-preview").hidden = false;
      $("ro-preview").scrollIntoView({ behavior: "smooth", block: "nearest" });
      say(`Tier ${tier} email created.`, false);
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
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

    async function copyEmail() {
      const text =
        `To: ${$("ro-p-to").textContent}\nCc: ${$("ro-p-cc").textContent}\n` +
        `Subject: ${$("ro-p-subject").textContent}\n\n${val("ro-p-body")}`;
      say((await copyText(text)) ? "Email text copied." : "Copy failed.", false);
    }

    async function copyChat() {
      const f = collect();
      const tier = pickTier(f.ssa, f.unplanned);
      if (!tier) return;
      const text =
        `Tier ${tier} repeat - ${f.node || "(node)"} (${f.hub || "hub"}) - ` +
        `24 hr: ${f.ssa}, 10 days: ${f.unplanned}, Y6: ${f.y6 || 0} - ` +
        `Tech: ${f.tech || "n/a"} - Order: ${f.order || "n/a"}`;
      say((await copyText(text)) ? "Chat summary copied." : "Copy failed.", false);
    }

    // ---- Screenshots ----
    function renderThumbs() {
      const list = $("ro-thumbs");
      list.innerHTML = "";
      images.forEach((img) => {
        const li = document.createElement("li");
        const pic = document.createElement("img");
        pic.src = img.url;
        pic.alt = img.name;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "od-link";
        btn.textContent = "Remove";
        btn.setAttribute("aria-label", "Remove " + img.name);
        btn.addEventListener("click", () => {
          URL.revokeObjectURL(img.url);
          images = images.filter((i) => i.id !== img.id);
          renderThumbs();
        });
        li.appendChild(pic);
        li.appendChild(btn);
        list.appendChild(li);
      });
    }

    function addFiles(files) {
      const allowed = ["image/png", "image/jpeg", "image/gif"];
      let rejected = 0;
      Array.from(files).forEach((file) => {
        if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024 || images.length >= 10) {
          rejected++;
          return;
        }
        images.push({ id: nextImageId++, name: file.name || "pasted image", url: URL.createObjectURL(file) });
      });
      renderThumbs();
      if (rejected) say(`${rejected} file${rejected === 1 ? " was" : "s were"} skipped (type, size or limit).`, true);
    }

    function onPaste(e) {
      const items = (e.clipboardData && e.clipboardData.items) || [];
      const files = [];
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length) {
        e.preventDefault();
        addFiles(files);
      }
    }

    function clearAll() {
      ["ro-order", "ro-power", "ro-inc", "ro-tech", "ro-tech-email", "ro-ssa", "ro-unplanned",
        "ro-y6", "ro-summary"].forEach((id) => setVal(id, ""));
      setLocation("", "", "", "");
      order = "";
      images.forEach((i) => URL.revokeObjectURL(i.url));
      images = [];
      renderThumbs();
      markMissing([]);
      $("ro-preview").hidden = true;
      $("ro-load-status").textContent = "";
      refreshTier();
      say("Cleared.", false);
    }

    // ---- Wiring ----
    $("ro-region").addEventListener("change", () => onLocationChange("region"));
    $("ro-market").addEventListener("change", () => onLocationChange("market"));
    $("ro-hub").addEventListener("change", () => onLocationChange("hub"));
    ["ro-ssa", "ro-unplanned"].forEach((id) => $(id).addEventListener("change", refreshTier));
    root.addEventListener("input", (e) => e.target.classList && e.target.classList.remove("od-missing"));
    root.addEventListener("change", (e) => e.target.classList && e.target.classList.remove("od-missing"));

    $("ro-load").addEventListener("click", () => loadOrder());
    $("ro-order").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); loadOrder(); }
    });
    root.querySelectorAll("[data-sample]").forEach((b) =>
      b.addEventListener("click", () => loadOrder(b.dataset.sample))
    );
    $("ro-create").addEventListener("click", createEmail);
    $("ro-copy").addEventListener("click", copyEmail);
    $("ro-chat").addEventListener("click", copyChat);
    $("ro-clear").addEventListener("click", clearAll);

    const drop = $("ro-drop");
    const fileInput = $("ro-file");
    drop.addEventListener("click", () => fileInput.click());
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
    drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("od-drop-over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("od-drop-over"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("od-drop-over");
      addFiles(e.dataTransfer.files);
    });
    document.addEventListener("paste", onPaste);

    // ---- Hand-off from the Outage Template demo ----
    const handoff = window.DemoHandoff && window.DemoHandoff.repeat;
    if (handoff) {
      window.DemoHandoff.repeat = null;
      const known = handoff.node && findNode(handoff.node);
      setLocation(
        known ? known.region : "",
        known ? known.market : "",
        known ? known.hub : "",
        known ? known.node : ""
      );
      setVal("ro-power", handoff.power);
      setVal("ro-tech", handoff.tech);
      setVal("ro-ssa", handoff.ssa);
      setVal("ro-unplanned", handoff.unplanned);
      setVal("ro-order", handoff.order);
      order = handoff.order || "";
      $("ro-load-status").textContent = "Filled in from the Outage Template demo.";
    }
    refreshTier();

    function findNode(name) {
      for (const region of Object.keys(GEOGRAPHY)) {
        for (const market of Object.keys(GEOGRAPHY[region])) {
          for (const hub of Object.keys(GEOGRAPHY[region][market])) {
            if (GEOGRAPHY[region][market][hub].includes(name)) return { region, market, hub, node: name };
          }
        }
      }
      return null;
    }

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(statusTimer);
      document.removeEventListener("paste", onPaste);
      images.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }

  (window.Pages = window.Pages || {})["repeat-outage"] = { render, mount };
})();
