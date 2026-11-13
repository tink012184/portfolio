(function () {
  "use strict";
  // IRIS Documenter: turns event details into clean IRIS/BP notes.

  const ACCOUNT_COUNT = 3;

  function render() {
    const accounts = Array.from({ length: ACCOUNT_COUNT }, (_, i) => `
          <fieldset class="order-section">
            <legend>Account #${i + 1}</legend>
            <div class="form-row">
              <label for="addr${i}">Address</label>
              <input type="text" id="addr${i}" name="addr${i}" data-field="address" />
            </div>
            <div class="form-row">
              <label for="acct${i}">Account #</label>
              <input type="text" id="acct${i}" name="acct${i}" data-field="account" />
            </div>
            <div class="form-row">
              <label for="find${i}">Findings</label>
              <input type="text" id="find${i}" name="find${i}" data-field="findings" />
            </div>
          </fieldset>`).join("");

    return `
  <div class="iris-container">
    <div class="node-wrapper">
      <label for="mainNode">Node:</label>
      <input type="text" id="mainNode" />
    </div>
    <form id="iris-form" autocomplete="off">
      <div class="section-grid">${accounts}
      </div>
      <div class="reason-wrapper">
        <label for="reasonBox">Reason for NTF:</label>
        <textarea id="reasonBox" name="reasonBox"></textarea>
      </div>
      <div class="actions">
        <button type="button" class="btn-primary" data-action="copy">Copy</button>
        <button type="button" class="btn-secondary" data-action="clear">Clear</button>
        <span class="status" role="status" hidden>Copied!</span>
      </div>
      <div class="output-wrapper" hidden>
        <textarea readonly aria-label="Generated notes"></textarea>
      </div>
    </form>
  </div>`;
  }

  function mount(root) {
    const form = root.querySelector("#iris-form");
    const mainNode = root.querySelector("#mainNode");
    const reason = root.querySelector("#reasonBox");
    const status = root.querySelector(".status");
    const outputWrapper = root.querySelector(".output-wrapper");
    const outputBox = outputWrapper.querySelector("textarea");
    const fieldsets = [...root.querySelectorAll(".order-section")];
    let copiedTimer = null;

    const readAccounts = () =>
      fieldsets.map((fs) => ({
        address: fs.querySelector('[data-field="address"]').value,
        account: fs.querySelector('[data-field="account"]').value,
        findings: fs.querySelector('[data-field="findings"]').value,
      }));

    function buildText() {
      let text = "";
      if (mainNode.value.trim()) {
        text += `Node: ${mainNode.value.trim()}\n\n`;
      }
      readAccounts().forEach((acc, i) => {
        if (acc.address || acc.account || acc.findings) {
          text += `Account ${i + 1}:\n`;
          text += `\u2022 Address ${acc.address.trim() || "N/A"}\n`;
          text += `\u2022 Account # ${acc.account.trim() || "N/A"}\n`;
          text += `\u2022 Findings ${acc.findings.trim() || "N/A"}\n\n`;
        }
      });
      if (reason.value.trim()) {
        text += `Reason for NTF: ${reason.value.trim()}\n`;
      }
      return text.trim();
    }

    async function generateOutput() {
      const text = buildText();
      outputBox.value = text;
      outputWrapper.hidden = !text;

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.warn("Clipboard write failed", err);
        return;
      }
      status.hidden = false;
      clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => (status.hidden = true), 1500);
    }

    function clearAll() {
      form.reset();
      mainNode.value = "";
      outputBox.value = "";
      outputWrapper.hidden = true;
      status.hidden = true;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      generateOutput();
    });
    root.querySelector('[data-action="copy"]').addEventListener("click", generateOutput);
    root.querySelector('[data-action="clear"]').addEventListener("click", clearAll);

    return () => clearTimeout(copiedTimer);
  }

  (window.Pages = window.Pages || {})["iris"] = { render, mount };
})();
