# Closed Caption Firefox Extension (`fixing` folder)

This is a Firefox browser extension that automatically translates video closed captions/subtitles on supported sites (YouTube, Udemy, Netflix, etc.) using the Google Translate API. It uses a custom in-popup color picker (jPicker) so the popup never loses focus during color selection.

The extension consists of:

- **`background.js`** – listens for translation requests from the content script and forwards them to the Google Translate API.
- **`content.js`** – injected into supported pages; reads subtitle text from the site's caption DOM, requests a translation via `background.js`, and renders the translated text back onto the page. Observes caption changes using a `MutationObserver`.
- **`popup.js` / `popup.html` / `popup.css`** – the toolbar popup UI. Provides a translation toggle, font size slider, text color picker, and target language selector. Uses the jPicker color picker widget.
- **`color-picker-init.js`** – initializes the jPicker widget and keeps its value in sync with the hidden color input in the popup. Because jPicker is embedded inside the popup, the popup never loses focus during color selection (unlike the native browser color dialog).
- **`manifest.json`** – extension manifest (version 2.8.0, Firefox/Gecko target, multiple `content_scripts` URL matches, default locale `en`). Keyboard shortcuts: `Ctrl+Shift+P` to open the popup, `Ctrl+Shift+K` to toggle translation.
- **`lib/`** – jQuery and jPicker library files used by the popup.

---

## Translation Logic

- The popup sends messages via `browser.runtime` to the content script whenever the user changes font size, text color, language, or the translation toggle.
- Settings are persisted in `browser.storage.sync` and restored automatically each time the popup opens.
- Defaults are set in the `Model` class (`content.js`) and `PopupModel` class (`popup.js`): text color `#111111`, language `ko` (Korean), font size `25`, toggle initially off. After the first interaction, values are remembered via storage.

---

## How to Add Support for a New Website

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

Open `content.js` and find the `Dom` object near the top of the file. It looks like this:

```js
e.default = {
  frontendmasters: { domWrapperAttrs: ".vjs-text-track-display", domAttrs: ".vjs-text-track-cue" },
  udemy: { domWrapperAttrs: "...", domAttrs: "...", domAttrsSub: "..." },
  youtube: { domWrapperAttrs: ".ytp-caption-window-container", domAttrs: ".captions-text" },
  // …
}
```

Add a new entry using the **second-level hostname** as the key (e.g. `newsite` for `www.newsite.com`):

```js
newsite: {
  domWrapperAttrs: ".caption-container",
  domAttrs: ".caption-line",
},
```

#### How to find the right selectors

Two selectors are needed.

**`domAttrs` — the element that contains the subtitle text**

Open DevTools (`F12`) and inspect the page while a subtitle is visible. Find the element whose text content is the subtitle line — or the element that directly wraps it. Copy its CSS class or `id`.

```html
<div class="caption-line">Hello world</div>
```
→ `domAttrs: ".caption-line"`

**`domWrapperAttrs` — the ancestor element that mutates on each subtitle change**

`domWrapperAttrs` is a parent (or higher ancestor) of `domAttrs`. It must be the element the browser **mutates** (adds/removes children, changes attributes) every time the subtitle updates — this is the element the `MutationObserver` watches.

To find it, keep DevTools open while the video plays. Watch for the element that highlights on every subtitle change.

```html
<div class="caption-container">       <!-- domWrapperAttrs -->
  <div class="caption-line">…</div>   <!-- domAttrs -->
</div>
```
→ `domWrapperAttrs: ".caption-container"`

**`domAttrsSub` (optional)**

Only needed if the site has a secondary caption container (e.g. a split or picture-in-picture layout that shows captions in a second region).

#### Summary

| Property | What to set |
|---|---|
| `domAttrs` | CSS selector for the element containing the subtitle text |
| `domWrapperAttrs` | CSS selector for the ancestor element that mutates on each subtitle change |
| `domAttrsSub` | *(optional)* CSS selector for a secondary subtitle container |
