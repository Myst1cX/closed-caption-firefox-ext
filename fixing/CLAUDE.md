Project: Closed Caption Translation Extension (Firefox/Chrome)
===============================================================

NOTE: already fixed, refer to FIX 2.md for new task.

This is a browser extension that automatically translates video closed captions/subtitles on supported sites (YouTube, Udemy, Netflix, etc.) using the Google Translate API. The extension consists of:

- **background.js** – listens for translation requests and forwards them to Google Translate.
- **content.js** – injects translated captions into the video player's DOM; observes caption changes via MutationObserver.
- **popup.js / popup.html / popup.css** – provides a settings panel (toggle translate, font size, text color, language selection). Uses the jPicker color picker widget.
- **color-picker-init.js** – initializes the jPicker widget and synchronizes its value with the hidden color input.
- **manifest.json** – extension manifest (version 2.8.0, multiple content script matches, default locale "en").
- **lib/** – jQuery and jPicker library files.

The translation logic:
- Popup sends messages (via chrome.runtime) to content script for font size, text color, language, and toggle.
- Settings are persisted in chrome.storage.sync and restored on popup open.
- Defaults are set in the Model class (content.js) and PopupModel class (popup.js): text color = "#111111", language = "ko" (Korean), font size = 25, toggle initially off. After first open, these values are remembered via storage.

Current task: Adapt four aspects of the extension:

1. Change the default text color (when no stored value exists) from black (#111111) to white (#ffffff).
   - Sources: src/model/subtitle/index.ts (line 26) and src/model/popup/PopupModel.ts (line 24).
   - Note that storage keeps the last chosen color, so only the very first launch without any saved preference should be affected.

2. Change the default language (when no stored value exists) from Korean ("ko") to English ("en").
   - Sources: src/model/subtitle/index.ts (line 25), src/model/popup/PopupModel.ts (line 27), and possibly src/content.ts where fallback language is set (`?? "ko"`).
   - Again, storage remembers the last selection, so this only applies to the first-ever opening of the extension or if no language has been saved.

3. Change the URL of the "bug reports and feedback" link in the popup footer.
   - In popup.html, the link currently points to: https://github.com/TakhyunKim/closed-caption-extension/issues
   - Update it to: https://github.com/Myst1cX/closed-caption-firefox-port/issues

4. Investigate and fix the visual distortion of the popup UI when the color picker pane opens.
   - Currently, when the user clicks the color swatch, the color picker container appears below the popup but overlaps the footer, causing minor distortion/layout shift. A previous attempt added "margin-top: 10px" to #color-picker-container to counteract a negative footer margin, but the result is still not "pretty" – the UI feels cramped or improperly aligned.
   - Please examine the CSS (popup.css and jPicker-1.1.6.min.css) and the overall popup layout (popup.html structure) to propose a cleaner solution that prevents the overlap and makes the color picker display appear neat and well-integrated. Consider alternative positioning, z-index adjustments, or restructuring the footer/picker relationship.

Please perform a thorough review of the relevant source files, identify the exact lines that need modification, and provide a detailed, actionable plan for each of the four points. Include code snippets where appropriate. Keep compatibility with both Firefox and Chrome (Manifest V2), and ensure that stored user preferences are respected.
