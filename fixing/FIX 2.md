Project: Closed Caption Translation Extension (Firefox/Chrome)
===============================================================

Additional UI layout fix: When the color picker (jPicker) is expanded, the overall popup becomes significantly taller to accommodate the picker. The bottom section (bug reports footer) expands proportionally to fill this extra height, but the **upper menu area** — containing the Subtitle toggle, Text Size slider, Text Color swatch, and Language selector — remains at its original (collapsed) height. This causes two problems:

1. The language selection menu (which is part of the upper area) visually overlaps or sits too close to the bug reports footer.
2. The upper controls look cramped and squeezed at the top while the footer has excessive empty space beneath it.

The desired outcome: When the color picker is open, the upper menu items should **also** expand or adjust their layout in a visually pleasing way, so that the entire popup feels evenly spaced and there is no overlap between the language menu and the footer. The footer should not be the only element that stretches; the spacing of the menu rows should increase or the container heights should become flexible.

Please analyze the current popup structure (popup.html, popup.css, and any relevant JavaScript that controls visibility) and propose a clean CSS-based solution that:

- Keeps the popup wrapper height flexible (no fixed pixel value that breaks when picker opens).
- Distributes vertical space more evenly between the upper controls and the footer when the picker is visible.
- Avoids any overlap or distortion of the language dropdown toggle and its options.
- Maintains the existing compact look when the picker is hidden (i.e., don't stretch things when it's closed).

Provide exact CSS changes and, if necessary, minimal HTML adjustments. The fix should be compatible with both Firefox and Chrome (Manifest V2) and not interfere with the color picker functionality.