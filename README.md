# Project Surprise — Template & UI Refresh

A no-build HTML/CSS/JavaScript prototype for a no-code personalized website generator.

## Run locally in VS Code

1. Extract this ZIP.
2. Open the `project-surprise` folder in VS Code.
3. Install the **Live Server** extension (Ritwick Dey), if needed.
4. Right-click `index.html` → **Open with Live Server**.

You can also run `python -m http.server 5500` from this folder and visit `http://localhost:5500`.

## What's updated

- Refreshed landing page with a more polished, modern visual style.
- Occasion cards now show how many designs are available.
- 14 template styles with mixed visual directions: romantic, cinematic, playful, scrapbook, botanical, editorial and minimal.
- The creator presents 2–4 curated designs for each occasion.
- Template cards include visual previews, descriptions and a sample-preview action.
- Improved mobile layouts, spacing, typography, hover states and form styling.
- Clear prototype warnings so users are not told that local links are publicly hosted.
- Existing admin, editing, photo resizing, standalone HTML download and site-rendering structure are preserved.

## Pages and files

| File | Purpose |
|---|---|
| `index.html` | Landing page, featured templates, process, proposed plans and prototype notice |
| `create.html` | Four-step occasion → template → personalization → export flow |
| `view.html?id=…` | Local-browser prototype viewer |
| `admin.html` | Local saved-site management, edit, export/import and delete |
| `css/style.css` | Refreshed platform UI styles |
| `js/templates.js` | Occasion data, template definitions and generated-site themes |
| `js/store.js` | Browser `localStorage` data layer |
| `js/create.js` | Wizard, previews, photo resizing and HTML export |

## Important limitations — not production publishing

- **No backend is connected.** Generated site records are saved in the current browser's `localStorage` only.
- The `view.html?id=…` link is not a public shareable link and will not resolve on another device/browser.
- The reliable handoff for this prototype is **Download HTML**. The exported HTML can be hosted separately (for example, on a static hosting service) or sent as a file.
- **No payment gateway, payment verification, accounts, public hosting, or automatic link delivery is implemented.** Do not take customer payments on the assumption these features work.
- The optional access-code gate is client-side and is not suitable for sensitive information.
- The template preview uses Google Fonts when the device has internet access; fallback system fonts are provided.

## Suggested next phase

After validating the templates with a few users, implement a backend (for example, Supabase or Firebase), managed photo storage, public site routing, and a payment gateway. Only publish and deliver a public link after the backend verifies payment server-side.
