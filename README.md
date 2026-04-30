# closed-caption-firefox-ext

A Firefox browser extension that reads the closed captions/subtitles already displayed on a video site and overlays a real-time translation powered by the Google Translate API. The popup UI stays open during color selection because it uses the embedded **jPicker** color picker instead of the native browser color dialog (which causes Firefox to close the popup).

---

## Supported sites

| Site | URL |
|---|---|
| Frontend Masters | frontendmasters.com |
| Udemy | www.udemy.com |
| YouTube | www.youtube.com |
| Epic React | epicreact.dev |
| TED | www.ted.com |
| Netflix | www.netflix.com |
| Three.js Journey | threejs-journey.com |
| Start | start.ru |

---

## Features

- **Translation toggle** — enable or disable subtitle translation with one click or with `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac).
- **Font size slider** — adjust the translated subtitle font size (range 10–40 px, default **25 px**).
- **Color picker** — choose any subtitle text color using the embedded jPicker widget (default **white / `#ffffff`**). The picker opens inside the popup so the popup never loses focus.
- **Language selector** — choose the target translation language from 24 supported languages (default **English**).
- **Persistent settings** — all settings are saved to `browser.storage.sync` and restored automatically each time the popup opens.

---

## Keyboard shortcuts

| Action | Windows / Linux | macOS |
|---|---|---|
| Open popup | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Toggle translation | `Ctrl+Shift+K` | `Cmd+Shift+K` |

---

## Supported translation languages

Arabic, Belarusian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Filipino, Finnish, French, German, Greek, Japanese, Korean, Polish, Portuguese, Spanish, Thai, Turkish, Ukrainian, Vietnamese.

Source language is always detected automatically.

---

## File overview (`fixing/` folder)

| File | Purpose |
|---|---|
| `manifest.json` | Extension manifest (version 2.8.0, Manifest V2, Firefox/Gecko ≥ 91, default locale `en`) |
| `background.js` | Service-worker script. Receives `"translate"` messages from the content script, calls the Google Translate API, and returns the translated string. Also listens for the `active-translate` keyboard command and forwards a toggle message to the content script. |
| `content.js` | Injected into every supported page. Reads the subtitle text from the site's caption DOM elements, sends it to `background.js` for translation, and inserts the translated text back into the page. Uses a `MutationObserver` on the caption wrapper element to detect new subtitle lines. |
| `popup.js` | Popup logic (MVC). Reads persisted settings from `browser.storage.sync` on open, then sends `browser.runtime` messages to `content.js` whenever the user changes font size, text color, language, or the toggle. |
| `popup.html` | Popup markup — toggle switch, font-size slider, color-swatch button, jPicker container, and language selector. |
| `popup.css` | Popup styles. |
| `color-picker-init.js` | Initialises the jPicker widget inside the popup. Handles the OK / live-update / cancel callbacks, keeps the color swatch button in sync with the hidden `<input type="color">` element that `popup.js` reads, and works around jPicker's initialisation-time event timing so the final chosen color is always sent to the content script. |
| `lib/` | jQuery and jPicker library files used by the popup. |
| `_locales/` | Localised extension name and description strings (21 locales). |
| `assets/` | Extension icon images. |

---

## How to add support for a new website

Two files need to be updated.

### 1. `manifest.json` — allow the extension to run on the new site

Open `manifest.json` and add the site's URL pattern to the `content_scripts → matches` array:

```json
"content_scripts": [
  {
    "matches": [
      "*://frontendmasters.com/*",
      "*://www.udemy.com/*",
      "*://www.newsite.com/*"
    ],
    "js": ["content.js"]
  }
]
```

Use `*://` to cover both `http` and `https`. Include `www.` only if the site requires it.

### 2. `content.js` — add the site's caption DOM selectors

Open `content.js` and find the `Dom` object near the top of the file. Add a new entry using the **second-level hostname** as the key (e.g. `newsite` for `www.newsite.com`):

```js
newsite: {
  domWrapperAttrs: ".caption-container",
  domAttrs: ".caption-line",
},
```

The key must be the second-level hostname — the part just before the TLD. For example:
- `www.youtube.com` → key is `youtube`
- `epicreact.dev` → key is `epicreact`
- `start.ru` → key is `start`

#### Finding the right selectors

**`domAttrs` — the element containing the subtitle text**

Open DevTools (`F12`) and inspect the page while a subtitle is visible. Find the element whose `textContent` is the subtitle line. Copy its CSS class or `id`.

```html
<div class="caption-line">Hello world</div>
```
→ `domAttrs: ".caption-line"`

**`domWrapperAttrs` — the ancestor element the MutationObserver watches**

This must be a parent (or higher ancestor) of `domAttrs` — specifically the element the browser mutates (adds/removes children or changes attributes) every time the subtitle updates.

Keep DevTools open while the video plays and watch for the element that highlights on every subtitle change.

```html
<div class="caption-container">       <!-- domWrapperAttrs -->
  <div class="caption-line">…</div>   <!-- domAttrs -->
</div>
```
→ `domWrapperAttrs: ".caption-container"`

**`domAttrsSub` (optional)**

Only needed if the site has a secondary caption container (e.g. a split or picture-in-picture layout that shows captions in a second region).

#### Selector property summary

| Property | What to set |
|---|---|
| `domAttrs` | CSS selector for the element containing the subtitle text |
| `domWrapperAttrs` | CSS selector for the ancestor element that mutates on each subtitle change |
| `domAttrsSub` | *(optional)* CSS selector for a secondary subtitle container |
