(function () {
  "use strict";
  // Static markup for the 'resume' page.
  function render() {
    return `<section class="section">
    <header class="resume-header" style="margin-bottom: 1.5rem">
      <h1 class="section-title">Resume</h1>
      <p class="section-subtitle">
        ROC Specialist IV, Code By Lissa developer, and lifelong problem-solver.
      </p>

      <div class="resume-actions">
        <a
          class="btn primary-btn"
          href="assets/docs/Melissa_Lutz_Resume.pdf"
          download="Melissa_Lutz_Resume.pdf">
          Download Melissa Lutz's Resume (PDF)
        </a>
      </div>
    </header>

    <div class="split">
      <!-- ===== LEFT PANEL / SIDEBAR ===== -->
      <aside class="panel">
        <h2>Contact</h2>
        <p><strong>Name:</strong> Melissa Lutz</p>
        <p><strong>Location:</strong> Plano, Texas</p>
        <p><strong>Email:</strong> mlutz121&#64;gmail.com</p>

        <h2>Links</h2>
        <p>
          <strong>GitHub:</strong>
          <a href="https://github.com/tink012184" target="_blank" rel="noopener">
            tink012184
          </a>
        </p>

        <h2>Core skills</h2>
        <ul>
          <li>HFC outage management & alarm analysis</li>
          <li>Maintenance dispatch & coax change processing</li>
          <li>Customer service (25+ years)</li>
          <li>Training, mentorship, & team support</li>
          <li>HTML, CSS, JavaScript, Angular, TypeScript</li>
          <li>Node.js (server-side JavaScript) & basic SQL</li>
          <li>VBA automation for Excel</li>
          <li>SmartSheet, Tableau, SharePoint</li>
        </ul>

        <h2>Areas of expertise</h2>
        <ul>
          <li>ROC IV network surveillance & outage triage</li>
          <li>Fiber, node, and service event investigation</li>
          <li>Routing, escalation workflows, and documentation</li>
          <li>Process improvement and playbook creation</li>
          <li>Tool-building under the Code By Lissa brand</li>
        </ul>
      </aside>

      <!-- ===== RIGHT PANEL / MAIN CONTENT ===== -->
      <section class="panel">
        <h2>Professional summary</h2>
        <p>
          ROC Specialist IV at Spectrum, part of Cox Communications (formerly Charter Communications),
          with expertise in HFC network surveillance, outage detection, troubleshooting, routing,
          and escalation workflows. Creator of Code By Lissa, building JavaScript operational
          tools, including the full-stack ROC Note Tool, as well as Angular apps. Known for
          process improvement, technical capability, and team leadership.
        </p>

        <h2>Professional experience</h2>

        <h3>ROC Specialist IV · Spectrum, Cox Communications (2019–Present)</h3>
        <ul>
          <li>
            Monitor and analyze the HFC network, identify outages, generate SROs,
            dispatch maintenance techs, and communicate outages to stakeholders.
          </li>
          <li>
            Create and maintain the ROC Note tool and other utilities that
            streamline fiber events, repeat outage documentation, IRIS updates,
            and many more tools needed in day to day ROC operations.
          </li>
          <li>
            Support workflow improvements by identifying gaps, standardizing
            templates, and helping refine best practices across the ROC.
          </li>
          <li>
            Support teammates with complex outages and advanced workflows,
            mentor newer agents, and serve as backup analyst.
          </li>
          <li>
            Serve as designated team lead (past year): lead day-to-day team
            operations, oversee outage routing strategy, facilitate communication
            between agents and leadership, and ensure adherence to ROC standards
            and best practices.
          </li>
        </ul>

        <h3>ECC Tech 2 · Comcast Enterprise (2016–2019)</h3>
        <ul>
          <li>
            Supported PRI, BVE, Metro E, Internet, Voice, and TV services for
            business customers.
          </li>
          <li>
            Troubleshot network and service issues, opened tickets, and escalated
            as needed.
          </li>
          <li>
            Communicated clearly with enterprise clients and internal NOC teams.
          </li>
        </ul>

        <h3>Previous leadership & customer roles</h3>
        <ul>
          <li>Night Foreman — King Soopers (2015–2016)</li>
          <li>Owner — Lissa’s Little Tykes Child Care (2011–2013)</li>
          <li>Assistant Manager — Teddy Bear Stuffing Factory (2008–2009)</li>
        </ul>

        <h2>Highlighted projects</h2>
        <ul>
          <li>
            <strong>ROC Note Tool – Creator</strong> · built with JavaScript and a
            server backend, and used by all four ROC teams.
          </li>
          <li>
            <strong>RPG Character Builder (Angular)</strong> · demo SPA for Web425
            coursework.
          </li>
          <li>
            <strong>Fiber Outage Template</strong> · standardized fiber event
            email and notes.
          </li>
          <li>
            <strong>Repeat Outage Builders</strong> · tools for Y6/repeat outage
            communication.
          </li>
          <li>
            <strong>ISP Email Generator</strong> · guided email builder for ISP
            escalations.
          </li>
          <li>
            <strong>JavaScript Automation Tools</strong> · utilities for ROC
            workflows and notes.
          </li>
        </ul>

        <h2>Education</h2>
        <ul>
          <li>
            <strong>BS, Web Development</strong> — Bellevue University,
            March 2026
          </li>
          <li><strong>Web Developer Certificate</strong> — Thinkful, 2024</li>
          <li>
            <strong
              >BA, Business Administration / Computer Information Systems</strong
            >
            — Florida Institute of Technology, 2012
          </li>
        </ul>
      </section>
    </div>
  </section>`;
  }

  (window.Pages = window.Pages || {})["resume"] = { render };
})();
