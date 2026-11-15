# Code By Lissa Portfolio

A static portfolio site written in vanilla JavaScript using plain `<script>` tags. There is no build step.

## Structure

- `index.html` - app shell (header, footer, router outlet) and site metadata
- `404.html` - sends clean addresses such as `/about` to `/#/about` on GitHub Pages
- `js/main.js` - route table, nav and footer behavior
- `js/router.js` - small hash router (`#/about`, `#/projects#roc-tools`); moves focus to the page heading after navigation
- `js/shared.js` - helpers used by both demos (repeat tier calculation, copy to clipboard)
- `js/pages/*.js` - one script per page, registering `render()` (and optional `mount()`) on `window.Pages`
- `css/` - global styles (`styles.css`) and the demo-page styles (`demos.css`)
- `assets/` - images, resume PDF, and the prebuilt RPG Character Maker demo
- `rpg-character-maker/` - Angular source for the RPG demo
- `tests/` - unit tests for the demo logic and site wiring

## Demos

The Outage Template and Repeat Outage Email Creator pages are working recreations of internal tools.
They use fake data and made-up system names ("WorkBoard", "TicketDesk"), and they make no network calls.
The test suite checks that real system and company names do not appear in those files.

## Run locally

Open `index.html` directly in a browser. The only part that needs a web server is the embedded Angular RPG demo (Angular builds use ES modules, which browsers block on `file://`). To see it, run:

```
npm start
```

Then open http://localhost:4200.

## Tests

```
npm test
```

Uses Node's built-in test runner, so there is nothing to install. Requires Node 20 or newer.

## RPG Character Maker

The Angular source lives in `rpg-character-maker/`. Its prebuilt output is in `assets/rpg-demo/` and is embedded on the demo page.

## Deploy

GitHub Pages serves the repository root from the `main` branch. Push to `main` and the site updates. The `CNAME` file sets the custom domain, and `.nojekyll` turns off Jekyll processing.