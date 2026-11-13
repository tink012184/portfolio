# Code By Lissa Portfolio

A static portfolio site written in vanilla JavaScript using plain <script> tags. There is no build step.

## Structure

- `index.html` - app shell (header, footer, router outlet)
- `js/main.js` - route table, nav and footer behavior
- `js/router.js` - small hash router (`#/about`, `#/projects#roc-tools`)
- `js/pages/*.js` - one script per page, registering `render()` (and optional `mount()`) on `window.Pages`
- `css/` - global styles plus the IRIS Documenter styles
- `assets/` - images, resume PDF, and the prebuilt RPG Character Maker demo

## Run locally

Open `index.html` directly in a browser. The only part that needs a web server is the embedded Angular RPG demo (Angular builds use ES modules, which browsers block on `file://`). To see it, run:

```
npm start
```

Then open http://localhost:4200.

## RPG Character Maker

The Angular source lives in `rpg-character-maker/`. Its prebuilt output is in `assets/rpg-demo/` and is embedded on the demo page.

## Deploy

Publish the repository root to GitHub Pages (`.nojekyll` is included).